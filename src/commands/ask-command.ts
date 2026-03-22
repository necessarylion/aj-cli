import chalk from "chalk";
import type { Command } from "commander";

export function registerAskCommand(program: Command) {
	program
		.command("ask-command")
		.description("Get the terminal command for a given task using Claude")
		.argument("<question>", "what you want to do")
		.action(async (question: string) => {
			const proc = Bun.spawn(
				[
					"claude",
					"-p",
					"--no-session-persistence",
					`What is the terminal command to: ${question}\n\nRespond with only the command and nothing else. No explanation, no markdown fences.`,
				],
				{ stdout: "pipe", stderr: "inherit" },
			);
			const output = await new Response(proc.stdout).text();
			const exitCode = await proc.exited;
			if (output.trim()) {
				console.log(chalk.green(output.trim()));
			}
			process.exit(exitCode);
		});
}
