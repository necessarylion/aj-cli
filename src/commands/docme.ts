import chalk from "chalk";
import type { Command } from "commander";

export function registerDocme(program: Command) {
	program
		.command("docme")
		.description("Add documentation comments to a file using Claude")
		.argument("<file>", "file to document")
		.action(async (file: string) => {
			if (!(await Bun.file(file).exists())) {
				console.log(chalk.red(`File not found: ${file}`));
				process.exit(1);
			}

			const content = await Bun.file(file).text();
			if (!content.trim()) {
				console.log(chalk.yellow(`File is empty: ${file}`));
				return;
			}

			const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
			let i = 0;
			const spinner = setInterval(() => {
				process.stdout.write(
					`\r${chalk.cyan(frames[i++ % frames.length])} Processing...`,
				);
			}, 80);

			const proc = Bun.spawn(
				[
					"claude",
					"-p",
					"--no-session-persistence",
					`Add documentation comments to the following code. Use the appropriate doc comment style for the language (e.g. JSDoc for JS/TS, docstrings for Python, etc.). Only add comments where they are missing or insufficient. Keep existing comments intact. Respond with only the full file content and nothing else — no markdown fences, no explanation:\n\n${content}`,
				],
				{ stdout: "pipe", stderr: "inherit" },
			);

			const output = await new Response(proc.stdout).text();
			const exitCode = await proc.exited;

			clearInterval(spinner);
			process.stdout.write("\r\x1b[K");

			if (exitCode !== 0 || !output.trim()) {
				console.log(chalk.red("Failed to generate documentation."));
				process.exit(1);
			}

			// Strip markdown code fences if present
			let cleaned = output.trim();
			cleaned = cleaned.replace(/^```[\w]*\n/, "").replace(/\n```$/, "");

			await Bun.write(file, `${cleaned.trimEnd()}\n`);
			console.log(chalk.green(`Documented: ${file}`));
		});
}
