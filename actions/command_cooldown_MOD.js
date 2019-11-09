module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Adjust Time Restriction",

	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------

	section: "Other Stuff",

	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------

	subtitle: function (data) {

		let value = parseInt(data.value);
		return `Command Cooldown: ${value} seconds`;
	},

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "Aamon#9130",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.9.5", //Added in 1.9.5

	mod_version: "2",

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "This mod will restrict a command",

	donate_url: "https://paypal.me/Aamoneel",

	//---------------------------------------------------------------------

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	//variableStorage: function (data, varType) {
	//},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["message", "value", "whattodo", "call"],

	//---------------------------------------------------------------------
	// Command HTML
	//
	// This function returns a string containing the HTML used for
	// editting actions.
	//
	// The "isEvent" parameter will be true if this action is being used
	// for an event. Due to their nature, events lack certain information,
	// so edit the HTML to reflect this.
	//
	// The "data" parameter stores constants for select elements to use.
	// Each is an array: index 0 for commands, index 1 for events.
	// The names are: sendTargets, members, roles, channels,
	//                messages, servers, variables
	//---------------------------------------------------------------------

	html: function (isEvent, data) {
		return `
	<div>
		<div>
			<p>
			Made by ${this.author}.<br>
			<span style="color: #FF0080; cursor: pointer" class="dntlink" data-url="${this.donate_url}"><b><u>Donate!</u></b></span>
			</p>
		</div>
		<div hidden style="float: left; width: 35%; padding-top: 20px;"> <<!-- todo: customized message-->
			Warning Message<br>
			<select id="message" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
				${data.messages[isEvent ? 1 : 0]}
			</select>
		</div>
		
		
		<div style="float: left; width: 90%; padding-top: 15px;">
			Time<br>
			<input id="value" class="round" type="text" placeholder="Insert Seconds Here (eg: 60 -for 1 min)..."><br>
		</div>

		<div style="width: 35%; padding-top: 20px;">
		If Cooldown is active: <br>
		<select id="whattodo" class="round">
			<option value="0">Jump to Action</option>
			<option value="1">Skip Actions</option>
			<option value="2">Do nothing</option>
			<option value="3">Continue Actions</option>
		</select>
		</div>
		<div style="width: 35%; padding-top: 20px;">
		<input id="call" class="round" type="text">
		</div>

		

	</div>`
	},

	//---------------------------------------------------------------------
	// Action Editor Init Code
	//
	// When the HTML is first applied to the action editor, this code
	// is also run. This helps add modifications or setup reactionary
	// functions for the DOM elements.
	//---------------------------------------------------------------------

	init: function () {

		try {
			const {
				glob,
				document
			} = this;

			const link = document.getElementsByClassName("dntlink");
			for (let x = 0; x < link.length; x++) {
				const dntlink = link[x],
					url = dntlink.getAttribute('data-url');
				if (url) {
					dntlink.setAttribute("title", url);
					dntlink.addEventListener("click", function (e) {
						e.stopImmediatePropagation();
						require('child_process').execSync('start ' + url);
					});
				}
			}
		} catch (err) {
			console.log(err);
		}
	},

	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter,
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------

	action: function (cache) {
		const data = cache.actions[cache.index];

		const value = parseInt(data.value);
		const message = parseInt(data.message);
		const varName = this.evalMessage(data.varName, cache);
		const msg = this.getMessage(message, varName, cache);
		const whattodo = parseInt(data.whattodo);
		const val = parseInt(this.evalMessage(data.call, cache));
		const index = Math.max(val - 1, 0);
		const index2 = cache.index + val + 1;


		//in the future update---- verify member permission/ add to dbm editor (maybe yes, maybe not)

		if (this.Cooldown(msg, value) === 1) {
			//console.log("execute");
			//and other stuff here if neded
			this.callNextAction(cache);
		} else {

			switch (whattodo) {
				case 0:
					if (cache.actions[index]) {
						cache.index = index - 1;
						this.callNextAction(cache);
					};
					break;
				case 1:
					if (cache.actions[index2]) {
						cache.index = index2 - 1;
						this.callNextAction(cache);
					};
					break;
				case 2:
					break;
				case 3:
					this.callNextAction(cache);


			}

			// msg.delete(); //delete author command message 
			//msg.reply(`please cool down! (**${value}** seconds left)`);
		}


	},

	//---------------------------------------------------------------------
	// Action Bot Mod
	//
	// Upon initialization of the bot, this code is run. Using the bot's
	// DBM namespace, one can add/modify existing functions if necessary.
	// In order to reduce conflictions between mods, be sure to alias
	// functions you wish to overwrite.
	//---------------------------------------------------------------------

	mod: function (DBM) {

		let userCooldown = {};

		DBM.Actions.Cooldown = function (msg, value) {

			if (userCooldown[msg.author.id]) { // member has time restrict
				//msg.reply("you cannot use this command")
				//userCooldown[msg.author.id] = false; 
				return 0;
			} else //member can use the command
			{
				//msg.reply(`you can use this command`); //execute command or something like that
				userCooldown[msg.author.id] = true;
				setTimeout(() => {
					userCooldown[msg.author.id] = false;
				}, value * 1000)
				return 1;
			}
		};
	}

}; // End of module