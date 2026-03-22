#!/usr/bin/env bun

import { Command } from "commander";
import { registerCommitMsg } from "./commands/commit-msg";
import { registerCron } from "./commands/cron";
import { registerDocme } from "./commands/docme";
import { registerKillport } from "./commands/killport";
import { registerPortwho } from "./commands/portwho";
import { registerRewrite } from "./commands/rewrite";
import { registerTranslate } from "./commands/translate";

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
