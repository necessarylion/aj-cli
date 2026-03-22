import chalk from "chalk";
import type { Command } from "commander";

export function registerCron(program: Command) {
	program
		.command("cron")
		.description(
			"Generate a cron expression from natural language using Claude",
		)
		.argument("<text>", "schedule description (e.g. 'every day at 3am')")
		.action(async (text: string) => {
			const proc = Bun.spawn(
				[
					"claude",
					"-p",
					"--no-session-persistence",
					`Convert the following natural language schedule into a cron expression. Respond with only the cron expression and nothing else:\n\n${text}`,
				],
				{ stdout: "pipe", stderr: "inherit" },
			);
			const output = await new Response(proc.stdout).text();
			const exitCode = await proc.exited;
			const cleaned = output.trim().replace(/`/g, "");
			if (cleaned) {
				console.log(chalk.green(`Cron Expression: ${cleaned}`));
			}
			process.exit(exitCode);
		});
}
