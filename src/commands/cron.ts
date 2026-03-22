import type { Command } from "commander";
import chalk from "chalk";

export function registerCron(program: Command) {
  program
    .command("cron")
    .description("Generate a cron expression from natural language using Claude")
    .argument("<text>", "schedule description (e.g. 'every day at 3am')")
    .action(async (text: string) => {
      const proc = Bun.spawn(
        [
          "claude",
          "-p",
          "--no-session-persistence",
          `Convert the following natural language schedule into a cron expression. Respond with only the cron expression and nothing else:\n\n${text}`,
        ],
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
