#!/usr/bin/env bun

import { Command } from "commander";
import { registerTranslate } from "./commands/translate";
import { registerKillport } from "./commands/killport";
import { registerCommitMsg } from "./commands/commit-msg";
import { registerPortwho } from "./commands/portwho";
import { registerDocme } from "./commands/docme";
import { registerRewrite } from "./commands/rewrite";
import { registerCron } from "./commands/cron";

const program = new Command();

program
  .name("aj")
  .description("A simple CLI built with Bun and Commander")
  .version("0.0.1");

registerTranslate(program);
registerKillport(program);
registerCommitMsg(program);
registerPortwho(program);
registerDocme(program);
registerRewrite(program);
registerCron(program);

program.parse();
