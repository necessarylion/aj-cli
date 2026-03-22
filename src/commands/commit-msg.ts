import type { Command } from "commander";
import chalk from "chalk";
import readline from "readline";

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

export function registerCommitMsg(program: Command) {
  program
    .command("commit-msg")
    .description("Generate a commit message from staged changes using Claude")
    .action(async () => {
      const diff = Bun.spawn(["git", "diff", "--cached"], { stdout: "pipe", stderr: "pipe" });
      const diffOutput = await new Response(diff.stdout).text();
      await diff.exited;

      if (!diffOutput.trim()) {
        console.log(chalk.yellow("No staged changes found. Stage your changes with 'git add' first."));
        return;
      }

      const proc = Bun.spawn(
        ["claude", "-p", "--no-session-persistence", `Based on the following git diff, generate a concise commit message. Follow conventional commits format (e.g. feat:, fix:, refactor:). Respond with only the commit message and nothing else:\n\n${diffOutput}`],
        { stdout: "pipe", stderr: "inherit" }
      );
      const output = await new Response(proc.stdout).text();
      await proc.exited;

      const message = output.trim();
      if (!message) {
        console.log(chalk.red("Failed to generate commit message."));
        process.exit(1);
      }

      console.log(chalk.green(message));
      console.log();

      const answer = await ask("Do you want to commit? (y/n) ");
      if (answer !== "y" && answer !== "yes") {
        console.log(chalk.yellow("Commit cancelled."));
        return;
      }

      const commit = Bun.spawn(["git", "commit", "-m", message], { stdout: "inherit", stderr: "inherit" });
      const commitCode = await commit.exited;
      process.exit(commitCode);
    });
}
