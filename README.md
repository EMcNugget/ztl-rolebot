# Discord-Bot
Discord bot for the official ZTL Discord.
Based on the VATUSA bot.

To install/run:
1. Clone the repo to your server
2. Create a .env file with the following parameters:
    - SERVER_PORT=80
    - MAIN_URL=https://vatusa.net
    - BOT_TOKEN=[ASK KYLE FOR THIS]
     - GUILD_ID=[GUILD ID FROM YOUR DISCORD SERVER]
    - CLIENT_ID=987022139393716264
    - API_URL=https://api.vatusa.net/v2/
3. Invite the bot to join your Discord server using this URL: https://discord.com/api/oauth2/authorize?client_id=987022139393716264&permissions=402655232&scope=bot%20applications.commands
4. The command above will create a new role called "rolebot" on your Discord server. Move it above all of the roles that the bot it allowed to assign in your Discord server role hierarchy (bots can't assign roles below the role of the bot)
5. Run "node register-commands.js" - this will register the /giveroles command on your Discord server.
6. Run the bot. "forever start app.js" should work just fine to keep it running continuously. 
7. If you want the bot to only listen/post in certain channels (i.e. a dedicated give-roles channel), set your bot's permissions as needed