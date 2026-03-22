import chalk from "chalk";
import type { Command } from "commander";

/**
 * Registers the `portwho` command, which identifies and displays information
 * about the process occupying a given network port.
 *
 * On Linux, it uses `ss` to query listening sockets.
 * On other platforms (macOS, etc.), it uses `lsof` and `ps` for richer output.
 *
 * @param program - The Commander program instance to register the command on.
 */
export function registerPortwho(program: Command) {
	program
		.command("portwho")
		.description("Show info about the process running on a given port")
		.argument("<port>", "port number to inspect")
		.action(async (port: string) => {
			const portNum = parseInt(port, 10);
			if (Number.isNaN(portNum)) {
				console.log(chalk.red(`Invalid port: ${port}`));
				process.exit(1);
			}

			const isLinux = process.platform === "linux";

			if (isLinux) {
				/** Query listening TCP sockets matching the given port via `ss`. */
				const proc = Bun.spawn(["ss", "-tlnp", `sport = :${portNum}`], {
					stdout: "pipe",
					stderr: "pipe",
				});
				const output = await new Response(proc.stdout).text();
				await proc.exited;

				const lines = output.trim().split("\n");
				if (lines.length <= 1) {
					console.log(chalk.yellow(`No process found on port ${portNum}`));
					return;
				}

				console.log(chalk.green(`Port ${portNum} is in use:\n`));
				console.log(output.trim());
			} else {
				/** Query open files (network connections) on the given port via `lsof`. */
				const proc = Bun.spawn(["lsof", "-i", `:${portNum}`, "-P", "-n"], {
					stdout: "pipe",
					stderr: "pipe",
				});
				const output = await new Response(proc.stdout).text();
				await proc.exited;

				if (!output.trim()) {
					console.log(chalk.yellow(`No process found on port ${portNum}`));
					return;
				}

				const lines = output.trim().split("\n");
				const header = lines[0];
				const rows = lines.slice(1);

				console.log(chalk.green(`Port ${portNum} is in use:\n`));
				console.log(chalk.dim(header));
				for (const row of rows) {
					console.log(row);
				}

				// Extract unique PIDs from lsof output and show detailed process info via ps
				const pids = [
					...new Set(
						rows.map((r) => r.split(/\s+/)[1]).filter((p): p is string => !!p),
					),
				];
				for (const pid of pids) {
					console.log(chalk.green(`\nProcess details (PID ${pid}):`));
					const ps = Bun.spawn(
						["ps", "-p", pid, "-o", "pid,ppid,user,%cpu,%mem,started,command"],
						{
							stdout: "pipe",
							stderr: "pipe",
						},
					);
					const psOutput = await new Response(ps.stdout).text();
					await ps.exited;
					if (psOutput.trim()) {
						const psLines = psOutput.trim().split("\n");
						console.log(chalk.dim(psLines[0]));
						for (const line of psLines.slice(1)) {
							console.log(line);
						}
					}
				}
			}
		});
}
