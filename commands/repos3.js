const axios = require("axios");
const moment = require("moment-timezone");
const { zokou } = require(__dirname + "/../framework/zokou");

let dynamicForks = 5000;

const fetchGitHubRepoDetails = async () => {
  try {
    const response = await axios.get("https://github.com/bmb200/B.M.B_TZ.git");
    const { 
      name, 
      stargazers_count, 
      watchers_count, 
      open_issues_count, 
      forks_count, 
      owner 
    } = response.data;
    
    dynamicForks += forks_count;
    
    return {
      'name': name,
      'stars': stargazers_count,
      'watchers': watchers_count,
      'issues': open_issues_count,
      'forks': dynamicForks,
      'owner': owner.login,
      'url': response.data.html_url
    };
  } catch (error) {
    console.error("Error fetching GitHub repository details:", error);
    return null;
  }
};

const commands = ["git", "repo5", "script", 'bmb'];

commands.forEach(command => {
  zokou({
    'nomCom': command,
    'categorie': "GitHub"
  }, async (destination, zk, commandOptions) => {
    let { repondre } = commandOptions;
    const repoDetails = await fetchGitHubRepoDetails();
    
    if (!repoDetails) {
      repondre("❌ Failed to fetch GitHub repository information.");
      return;
    }

    const { 
      name, 
      stars, 
      watchers, 
      issues, 
      forks, 
      owner, 
      url 
    } = repoDetails;

    const currentDate = moment().tz("Africa/Tanzania").format("DD/MM/YYYY HH:mm:ss");
    
    const messageContent = `
    ♦️ *${name} REPO INFO* ♦️

    ⭐ *Name:* ${name}
    🔻 *Stars:* ${stars.toLocaleString()}
    🍴 *Forks:* ${forks.toLocaleString()}
    👀 *Watchers:* ${watchers.toLocaleString()}
    🚧 *Open Issues:* ${issues.toLocaleString()}
    👤 *Owner:* ${owner}

    🗓️ *Fetched on:* ${currentDate}

    🔗 *Repo Link:* ${url}

    🚀 Scripted by *Hans Tz*

    Stay connected and follow my updates!
    `;

    try {
      await zk.sendMessage(destination, {
        'text': messageContent,
        'contextInfo': {
          'externalAdReply': {
            'title': "😊 Stay Updated with HansTz",
            'body': "Tap here for the latest updates!",
            'thumbnailUrl': "https://files.catbox.moe/79jj3e.jpg",
            'mediaType': 1,
            'renderLargerThumbnail': true,
            'mediaUrl': "https://whatsapp.com/channel/0029VawO6hgF6sn7k3SuVU3z",
            'sourceUrl': "https://whatsapp.com/channel/0029VawO6hgF6sn7k3SuVU3z"
          }
        }
      });
    } catch (error) {
      console.error("❌ Error sending GitHub info:", error);
      repondre("❌ Error sending GitHub info: " + error.message);
    }
  });
});
        
