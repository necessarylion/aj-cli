import type { Command } from "commander";
import chalk from "chalk";

export function registerTranslate(program: Command) {
  program
    .command("translate")
    .description("Translate text to English using Claude")
    .argument("<text>", "text to translate")
    .action(async (text: string) => {
      const proc = Bun.spawn(
        ["claude", "-p", "--no-session-persistence", `Translate the following text to English. Respond with only the translated text and nothing else:\n\n${text}`],
        { stdout: "pipe", stderr: "inherit" }
      );
      const output = await new Response(proc.stdout).text();
      const exitCode = await proc.exited;
      if (output.trim()) {
        console.log(chalk.green(output.trim()));
      }
      process.exit(exitCode);
    });
}
