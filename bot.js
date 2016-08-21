const rp = require('minimal-request-promise');
const botBuilder = require('claudia-bot-builder');
const fbTemplate = botBuilder.fbTemplate;
const AIMLInterpreter = require('aimlinterpreter');
var aimlInterpreter = new AIMLInterpreter({name:'Philip', age:'42'});
aimlInterpreter.loadAIMLFilesIntoArray(["aiml/bot.aiml"]);

const api = botBuilder((request, originalApiRequest) => {
  console.log(JSON.stringify(request))
  originalApiRequest.lambdaContext.callbackWaitsForEmptyEventLoop = false

    return rp.get(`https://graph.facebook.com/v2.6/${request.sender}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${originalApiRequest.env.facebookAccessToken}`)
      .then(response => {
        const user = JSON.parse(response.body);
        aimlInterpreter.findAnswerInLoadedAIMLFiles(request.text, function(answer, wildCardArray, input){
            console.log(answer + ' | ' + wildCardArray + ' | ' + input);
            if(answer){
              roboResponse = answer;
            }else{
              roboResponse = "no response found in aiml";
            }
        });
        return [
          roboResponse
        ]
      })
});

module.exports = api;
