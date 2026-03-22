import chalk from "chalk";
import type { Command } from "commander";

export function registerKillport(program: Command) {
	program
		.command("killport")
		.description("Kill process running on a given port")
		.argument("<port>", "port number to kill")
		.action(async (port: string) => {
			const portNum = parseInt(port, 10);
			if (Number.isNaN(portNum)) {
				console.log(chalk.red(`Invalid port: ${port}`));
				process.exit(1);
			}

			const isLinux = process.platform === "linux";
			const cmd = isLinux
				? ["fuser", "-k", `${portNum}/tcp`]
				: ["lsof", "-ti", `:${portNum}`];

			const proc = Bun.spawn(cmd, { stdout: "pipe", stderr: "pipe" });
			const output = await new Response(proc.stdout).text();
			await proc.exited;

			if (!output.trim()) {
				console.log(chalk.yellow(`No process found on port ${portNum}`));
				return;
			}

			if (isLinux) {
				console.log(chalk.green(`Killed process on port ${portNum}`));
				return;
			}

			// macOS: lsof returns PIDs, kill them
			const pids = output.trim().split("\n");
			for (const pid of pids) {
				Bun.spawn(["kill", "-9", pid]);
			}
			console.log(
				chalk.green(
					`Killed ${pids.length} process(es) on port ${portNum} (PID: ${pids.join(", ")})`,
				),
			);
		});
}
