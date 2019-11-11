module.exports = {

    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------
    
    name: "Store Ban Info MOD",
    
    //---------------------------------------------------------------------
    // Action Section
    //
    // This is the section the action will fall into.
    //---------------------------------------------------------------------
    
    section: "Member Control",
    
    //---------------------------------------------------------------------
    // Action Subtitle
    //
    // This function generates the subtitle displayed next to the name.
    //---------------------------------------------------------------------
    
    subtitle: function(data) {
        const info = ['Executor Member Object', 'Banned Member Object', 'Reason', 'Banned Date', 'Banned Timestamp', 'Total Banned Count'];
        return `${data.member} - ${info[data.info]}`;
    },
    
    
    author: "LeonZ",
    version: "1.1.0",
    
    //---------------------------------------------------------------------
    // Action Storage Function
    //
    // Stores the relevant variable info for the editor.
    //---------------------------------------------------------------------
    
    variableStorage: function(data, varType) {
        const info = parseInt(data.info);
        let dataType;
        switch(info) {
            case 0:
            case 1:
                dataType = "Member Object";
                break;
            case 2:
                dataType = 'Text';
                break;
            case 3:
                dataType = 'Date';
                break;
            case 4:
            case 5:
                dataType = 'Number';
                break;
        }
        return ([data.varName, dataType]);
    },
    
    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------
    
    fields: ["info", "member", "storage", "varName"],
    
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
    
    html: function(isEvent, data) {
        return `
    <div>
        <div style="float: left; width: 94%;">
            Source Info:<br>
            <select id="info" class="round" onchange="glob.onChange0(this)">
                <option value="0" selected>Executor User Object</option>
                <option value="1">Banned User Object</option>
                <option value="2">Reason</option>
                <option value="3">Banned Date</option>
                <option value="4">Banned Timestamp</option>
                <option value="5">Total Banned Count (Included Bot)</option>
            </select><br>
        </div>
    </div><br><br><br>
    <div>
        <div id="Input0" style=" display: none; float: left; width: 104%;">
            Banned Member ID / Username:<br>
            <input id="member" class="round" type="text"><br>
        </div>
    </div>
    <div>
        <div style="float: left; width: 35%;">
            Store In:<br>
            <select id="storage" class="round">
                ${data.variables[1]}
            </select><br>
        </div>
        <div style="float: right; width: 60%;">
            Variable Name:<br>
            <input id="varName" class="round" type="text"><br>
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
    
    init: function() {
        const {glob, document} = this;
        const Input0 = document.getElementById('Input0');
    
        glob.onChange0 = function(info) {
            if (parseInt(info.value) == 5) {
                Input0.style.display = 'none';
            } else {
                Input0.style.display = null;
            }
        }
    
        glob.onChange0(document.getElementById('info'));
    },
    
    //---------------------------------------------------------------------
    // Action Bot Function
    //
    // This is the function for the action within the Bot's Action class.
    // Keep in mind event calls won't have access to the "msg" parameter, 
    // so be sure to provide checks for variable existance.
    //---------------------------------------------------------------------
    
    action: function(cache) {
        const data = cache.actions[cache.index];
        const member = this.evalMessage(data.member, cache);
        const info = parseInt(data.info);
        const server = cache.server;
        const storage = parseInt(data.storage);
        const varName = this.evalMessage(data.varName, cache);
        let result;
        if (info !== 5) {
            let options = {};
            options.type = 22;
            server.fetchAuditLogs(options).then(Audits => {
                let banned = Audits.entries.find(user => (user.target.id === member || user.target.username === member))
                switch(info) {
                    case 0:
                        result = banned.executor;
                        break;
                    case 1:
                        result = banned.target;
                        break;
                    case 2:
                        result = banned.reason;
                        break;
                    case 3:
                        result = banned.createdAt;
                        break;
                    case 4:
                        result = banned.createdTimestamp;
                        break;
                }
                if (result !== undefined) {
                    this.storeValue(result, storage, varName, cache);
                }
                this.callNextAction(cache);
            })
    
        } else {
            server.fetchBans().then(Bans => {
                result = Bans.size;
                if (result !== undefined) {
                    this.storeValue(result, storage, varName, cache);
                }
                this.callNextAction(cache);
            })
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
    
    mod: function(DBM) {
    }
    
    }; // End of module