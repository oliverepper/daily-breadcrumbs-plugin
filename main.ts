// Created by Oliver Epper
// https://oliver-epper.de

import { Plugin, PluginSettingTab, Setting } from 'obsidian';

export default class MyPlugin extends Plugin {
	settings: Settings;

	async onload() {

		this.settings = (await this.loadData()) || new Settings();

		this.addCommand({
			id: 'insert-daily-breadcrumbs',
			name: 'Insert Daily Breadcrumbs',
			callback: () => {
				this.getDateCommand();
			},
		});

		this.addSettingTab(new SettingsTab(this.app, this));
	}


	getMoment(date: Date): any {
		return (window as any).moment(date);
	}

	getDateCommand() {
		let activeLeaf: any = this.app.workspace.activeLeaf;
		let editor = activeLeaf.view.sourceMode.cmEditor;
		editor.replaceSelection(
		  '◀️ [[' + this.getMoment(new Date()).subtract(1, 'day').format(this.settings.format) + ']] || ' +
		  '[[' + this.getMoment(new Date()).add(1, 'day').format(this.settings.format) + ']] ▶️'
		);
	  }
}

class Settings {
	format: string = "YYYY-MM-DD";
}

class SettingsTab extends PluginSettingTab {
	display(): void {
		let { containerEl } = this;
		const plugin: any = (this as any).plugin;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Datumsformat")
			.setDesc("Format für das Datum der Breadcrumbs")
			.addMomentFormat((text) =>
				text
					.setDefaultFormat("YYYY-MM-DD")
					.setValue(plugin.settings.format)
					.onChange((value) => {
						if (value === "") {
							plugin.settings.format = "YYYY-MM-DD";
						} else {
							plugin.settings.format = value.trim();
						}
						plugin.saveData(plugin.settings);
					})
			);
	}
}