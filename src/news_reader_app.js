// Use this sample to create your own voice commands
// intent('hello world', p => {
//     p.play('(hello|hi there)');
// });
intent('What does this app do?', 'Whast can I do here?', 
      reply('This is a news project'));

// intent('Start a command', (p) => {
//     p.play({command: 'testCommand'})
// })

const API_KEY = '789d1b502a304499b839ceda86e04cee';
let savedArticles = [];

// News by Source
intent('Give me the news from $(source* (.*))', (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines`;
    
    if(p.source.value) {
        p.source.value = p.source.value.toLowerCase().split(" ").join("-");
        NEWS_API_URL = `${NEWS_API_URL}?sources=${p.source.value}&apiKey=${API_KEY}`
    }
    
    api.request(NEWS_API_URL, {headers: {"user-agent": 'user agent' }}, (error, response, body) => {
        const { articles } = JSON.parse(body);
        
        if(!articles.length) {
            p.play(`Sorry, I\'m having trouble finding news from ${p.source.value}. Please try searching for news from somewhere else.`);
            return;
        }
        
        savedArticles = articles;
        
        p.play({ command: 'newHeadlines', articles });
        p.play(`Here are the (latest|most recent) headlines from ${p.source.value}.`);
        
        p.play('Would you like me to read the headlines?');
        p.then(confirmation);
    });
})

// News by Term
intent('What\'s up with $(term* (.*))', (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/everything`;
    
    if(p.term.value) {
        p.term.value = p.term.value.toLowerCase().split(" ").join("-");
        NEWS_API_URL = `${NEWS_API_URL}?q=${p.term.value}&apiKey=${API_KEY}`
    }
    
    api.request(NEWS_API_URL, {headers: {"user-agent": 'user agent' }}, (error, response, body) => {
        const { articles } = JSON.parse(body);
        
        if(!articles.length) {
            p.play(`I can\'t find any news about ${p.term.value}. Look for news about something else.`);
            return;
        }
        
        savedArticles = articles;
        
        p.play({ command: 'newHeadlines', articles });
        p.play(`Here are the (latest|most recent) headlines about ${p.term.value}.`);
        
        p.play('Would you like me to read the headlines?');
        p.then(confirmation);
    });
})

// News by Category
const CATEGORIES = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
const CATEGORIES_INTENT = `${CATEGORIES.map((category) => `${category}`).join('|')}`;

intent(`(show|what is|tell me|what's|what are|what're|read) (the|) (recent|latest|) $(N news|headlines) (in|about|on|) $(C~ ${CATEGORIES_INTENT})`,
  `(read|show|get|bring me|give me) (the|) (recent|latest) $(C* .+) $(N news|headlines)`, (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines`;
    
    if(p.C.value) {
        NEWS_API_URL = `${NEWS_API_URL}?category=${p.C.value}&country=us&apikey=${API_KEY}`;
    }
    
    api.request(NEWS_API_URL, {headers: {"user-agent": 'user agent' }}, (error, response, body) => {
        const { articles } = JSON.parse(body);
        
        if(!articles.length) {
            p.play(`I can\'t find any news about ${p.C.value}. Look for a different category.`);
            return;
        }
        
        savedArticles = articles;
        
        p.play({ command: 'newHeadlines', articles });

        if(p.C.value) {
            p.play(`Here are the (latest|most recent) articles about ${p.C.value}.`);
        }else {
            p.play(`Here are the (latest|most recent) headlines`);
        }
        
        p.play('Would you like me to read the headlines?');
        p.then(confirmation);
    });
})
const confirmation = context(() => {
    intent('yes', async (p) => {
        for(let i = 0; i < savedArticles.length; i++){
            p.play({ command: 'highlight', article: savedArticles[i]});
            p.play(`${savedArticles[i].title}`);
        }
    })
    
    intent('no', (p) => {
        p.play('Whatever. Easier for me.')
    })
})

intent('open (the|) (article|) (number|) $(number* (.*))', (p) => {
    if(p.number.value) {
        p.play({ command:'open', number: p.number.value, articles: savedArticles})
    }
})

intent('(go|) back', (p) => {
    p.play('Hold on while we take a journey back in time!');
    p.play({ command: 'newHeadlines', articles: []})
})