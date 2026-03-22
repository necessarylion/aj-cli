import type { Command } from "commander";
import chalk from "chalk";

export function registerRewrite(program: Command) {
  program
    .command("rewrite")
    .description("Rewrite text in a given tone using Claude")
    .argument("<text>", "text to rewrite")
    .argument("[tone]", "tone: fri (friendly) or pro (professional)", "pro")
    .action(async (text: string, tone: string) => {
      const toneMap: Record<string, string> = {
        fri: "friendly",
        friendly: "friendly",
        pro: "professional",
        professional: "professional",
      };
      const fullTone = toneMap[tone] || tone;

      const proc = Bun.spawn(
        [
          "claude",
          "-p",
          "--no-session-persistence",
          `Rewrite the following text in a ${fullTone} tone. Respond with only the rewritten text and nothing else:\n\n${text}`,
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
