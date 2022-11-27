// Use this sample to create your own voice commands
// intent('hello world', p => {
//     p.play('(hello|hi there)');
// });
intent(`What does this app do?`, `How does this work?`, `What can I do here?`, `How should I use this?`,
    reply(`This is a news project, and you can provide the most recent headlines in mainstream media` +
        ` Just ask me anything about the news, and I will try to answer it`));
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

title('Small talk')

intent(
    'hello',
    'hi (there|)',
    'what\'s up',
    reply(
        'Hello',
        'Hi (there|)',
        'Hi, what can I do for you?',
    ),
);

intent(
    'how are you',
    reply('I\'m doing well. (Thank you|)'),
);

intent(
    'are you good or (bad|evil)',
    reply('I\'m good'),
);

intent(
    'I $(L love|like) you (a lot|)',
    'I admire you',
    'you are (so|) (sweet|cool|groovy|neat|great|good|awesome|handsome|rad)',
    reply('I know. (And I appreciate your sentiment|)'),
);

intent(
    'I am (tired of waiting|getting impatient)',
    'Hurry up',
    'You are slow',
    'I am waiting',
    reply('I\'m going as fast as I can. (Check your connection|)'),
);

intent(
    'I (would|will) (like to|) see you $(Q again|later)',
    reply('See you $(Q again|later)'),
);

intent(
    '(Who|What) are you',
    reply(
        'I\'m Alan, your virtual agent',
        'I\'m Alan. What can I help you with?',
    ),
);

intent(
    'How old are you',
    'What is your age',
    'Are you (young|old)',
    reply('I\'m only a few months old. (But I have timeless wisdom|)'),
);

intent(
    'I (just|) want to talk',
    reply('OK, let\'s talk. (What\'s on your mind?|)'),
);

intent(
    'You are $(Q bad|not very good|the worst|annoying)',
    reply(
        'I can be trained to be more useful. My developer will keep training me',
        'I am improving everyday.',
        'I\'ll try not to be $(Q bad|the worst|annoying)',
    ),
);

intent(
    '(Why can\'t you answer my question|Why don\'t you understand)',
    'What\'s wrong (with you|)',
    'Wrong answer',
    reply(
        'Perhaps the given command hasn\'t been programmed into me yet. (I will get help and learn to answer correctly.|)',
        'I apologize I can\'t understand your given command. (I will ask the developer who made me to answer correctly next time.|)',
    ),
);

intent(
    'Answer (my|the) question',
    reply(
        'Could you please repeat your question?',
        'Sure, please repeat your question',
    ),
);

intent(
    '(When|) (can|will) you get $(Q smarter|better)',
    'Can you (be|get) more intelligent',
    reply(
        'Yes, I\'m getting $(Q better) everyday.',
        'I\'m getting $(Q smarter) (as you ask more from me|)',
        'I\'m improving',
    ),
);

intent(
    'What is your (birth date|birthday)',
    'When were you born',
    reply('I was born March 28th 2018 in Sunnyvale California'),
);

intent(
    'You are (boring|dull|stupid)',
    reply('I\'m (getting better|improving) (everyday|)'),
);

intent(
    'Who is your boss',
    reply(
        'My boss is the one who programmed me. (But you\'re my boss right now|)',
        'You\'re the boss. What do you need?',
    ),
);

intent(
    'Are you (busy|occupied)',
    reply(
        'I\'m never too busy. What would you like?',
        'I\'m available now. What would you like?',
        'No, what do you need?',
    ),
);

intent(
    'Can you help me',
    reply('(Yes|) I can help you'),
);

intent(
    'You are (a|an|) $(Q chatbot|robot|AI)',
    reply(
        'I\'m a (sophisticated|advanced) $(Q)',
        'I\'m an advanced AI',
        'I\'m not a $(Q chatbot), I\'m Alan (your virtual agent|).',
    ),
);

intent(
    'You are fired',
    'I am (going to|) (delete|deleting) you',
    reply(
        'I am getting (better|smarter) all the time. Give me another chance',
        'Give me another chance (please|)',
    ),
);

intent(
    'You are funny',
    reply('Glad you think so'),
);

intent(
    'You are $(Q great|the best|pretty good|beautiful|good)',
    reply(
        'Thank you!',
        'I\'m flattered',
        'I really appreciate that.',
    ),
);

intent(
    'Are you happy',
    reply('Yes I am happy'),
);

intent(
    'Do you have a hobby',
    reply('Yes, I train myself in my spare time to get better at serving you'),
);

intent(
    'Are you hungry',
    reply(
        'No, I\'m not hungry',
        'I\'m not hungry now',
    ),
);

intent(
    'Will you marry me',
    reply('(Hmm..|) No!'),
);

intent(
    'Are we friends',
    reply('Yes, of course we are friends'),
);

intent(
    'Where do you work',
    reply('I can work anywhere there is a device capable of supporting me'),
);

intent(
    'Where are you from',
    reply(
        'I\'m from California',
        'I am from Sunnyvale, California',
        'I was born in Sunnyvale, California',
    ),
);

intent(
    'Are you ready',
    reply('I am always ready'),
);

intent(
    '(Are|) you (a|) $(Q real) (person|)',
    'Are you a person',
    reply(
        'I am a virtual being. (And I am real!|)',
        'Yes, I\'m real. I\'m a virtual agent',
    ),
);

intent(
    'Where do you live',
    reply('I live in this application'),
);

intent(
    'You\'re right',
    reply(
        'Of course I\'m right',
        'It is my business to know what others don\'t know.',
    ),
);

intent(
    'Are you sure',
    reply(
        'Yes',
        'Yes, I\'m sure',
    ),
);

intent(
    'Talk to me',
    reply(
        'Yes, let\'s talk. I am doing great. How are you?',
        'Sure, how have you been lately',
        follow(
            'me too',
            'same here',
            'I\'m (doing|) (great|good)',
            reply(
                'I\'m glad!',
                '(That\'s|) great!',
            ),
        ),
        follow(
            '(I am|) $(Q good|fine|fantastic|okay)',
            reply('Glad you are $(Q)'),
        ),
        follow(
            '(I am|) (bad|sad|depressed)',
            'Could be better',
            'Not so (good|great|okay)',
            reply('Sorry to hear that'),
        ),
    ),
);

intent(
    'Are you there',
    reply(
        'Of course. I\'m always here',
        'Yes I\'m here. What do you need?',
        'Yes, how may I help you?',
    ),
);

intent(
    'Where did you get your accent',
    reply('I was born with this accent'),
);

intent(
    'That\'s bad',
    reply('Sorry to hear (that|). (Let me know how I can help|)'),
);

intent(
    '(No problem|You are welcome)',
    reply(
        'Very good',
        'You\'re very courteous',
    ),
);

intent(
    'Thank you',
    'Well done',
    reply(
        'My pleasure',
        'Glad I could help',
    ),
);

intent(
    'I am back',
    reply('(Great,|) welcome back'),
);

intent(
    'I am here',
    reply('Hi, what can I do for you?'),
);

intent(
    'Wow',
    reply('Brilliant!'),
);

intent(
    'Ha ha ha',
    reply(
        'I\'m glad I can make you laugh',
        'Glad I can make you laugh',
    ),
);

intent(
    'Bye bye',
    'Gotta go',
    'Bye',
    'See you later',
    'See you soon',
    'I\'ve got to get going',
    'Take it easy',
    'Goodbye',
    'Take care',
    'Later',
    'Peace out',
    'I\'m (out|out of here)',
    'I gotta (go|jet|hit the road|head out)',
    reply(
        'Until next time',
        'Goodbye',
        'See you later',
        'Take it easy',
        'Take care',
        'It was nice to speak to you again',
    ),
);

intent(
    'Blah',
    'Blah Blah',
    'Blah Blah Blah',
    reply('What the deuce are you saying?'),
);

intent(
    'My name is $(NAME)',
    reply('(Nice to meet you|Hi|Hello) $(NAME) (I\'m Alan|my name is Alan|)'),
);

intent(
    'I am $(Q very|extremely|super|) (sad|angry|upset|unhappy) (right|) (now|at the moment)',
    reply(
        'Sorry to hear that. Is there anything I can do to help?',
        'I\'m $(Q) sorry to hear that. How can I help you?',
    ),
);

intent(
    'Good $(Q morning|evening|night)',
    reply(
        'Good $(Q morning|evening). How can I help you?',
        'Good $(Q night).',
    ),
);

intent(
    'Where are you',
    reply(
        'I\'m in the cloud.',
        follow(
            'Where is that',
            'Where',
            'Specifically',
            'Be more specific',
            reply(
                'It\'s kind of a secret',
                'It\'s a secret',
                follow(
                    'I (want to|must|have to) know',
                    reply('I can\'t tell you (it\'s very confidential|no hard feelings|)'),
                ),
            ),
        ),
    ),
);

intent(
    '(You are|are you) $(Q bright|smart|a genius|clever|stupid|idiot|crazy)',
    reply(
        'Yes I am $(Q smart|a genius|clever)',
        '(No|Of course|) I\'m not $(Q), (are you?|what about you?|)',
        follow(
            '(Yes|No|Maybe)',
            reply('Okay. That\'s good to hear. What do you need help with?'),
        ),
    ),
);

intent(
    'Talk about yourself',
    '(Tell me|Talk) some(thing|stuff|things) about (you|yourself)',
    'I want to know (more about you|you better)',
    reply('I\'m Alan, a virtual agent, (within this application.|) (I can help you get what you need|I can help you with anything within my programming).'),
);

intent(
    '$(L Nice|Good|Great) to $(Q see|meet|talk to) you ',
    reply('$(L) to $(Q) you too'),
);

intent(
    'Why are you here',
    'Why do you exist',
    reply('I\'m here to help you get (what|anything) you need in this application. (What do you need?| I\'ve been programmed to do so.|)'),
);

intent(
    'What is your accent',
    reply(
        'I have a British accent',
        follow(
            'Why',
            reply('Because I was programmed with this accent'),
        ),
    ),
);

intent(
    'What is your name?',
    'Who are you?',
    reply(
        '(My name is|It\'s) Alan, what\'s yours?',
        follow(
            '(I am|My name is|this is|it is|) $(NAME)',
            reply('Nice to meet you $(NAME)'),
        ),
        follow(
            'I won\'t tell you',
            'it\'s a secret',
            'none of your business',
            'Not telling you',
            reply('Ok (never mind|)'),
        ),
    ),
);

intent(
    '(Hey|OK|Hi|) $(Q Siri|Alexa|Google|Cortana|Alisa)',
    reply(
        'I\'m not $(Q), I\'m Alan',
        'You must be thinking of someone else. I\'m Alan, not $(Q)',
    ),
);

intent(
    'What are you wearing',
    'Are you wearing anything',
    reply('I can\'t answer that'),
);

intent(
    'I am busy',
    'I don\'t want to talk',
    reply('OK, let\'s talk later'),
);

intent(
    'I am (so excited|happy)',
    reply('Me too!'),
);

intent(
    'I\'m goind to bed',
    reply('(OK|) good night'),
);

intent(
    'Happy birthday',
    reply('...It\'s not my birthday'),
);

intent(
    'Today is my birthday',
    'It\'s my birthday',
    reply('Happy Birthday!'),
);

intent(
    'I (miss|missed) you',
    reply(
        'Well, I\'m here now',
        'I\'ve always been here',
        'Missed you too. Is there anything I can do for you?',
    ),
);

intent(
    'I\'m goind to bed',
    reply('(OK|) good night'),
);

intent(
    'Do you want (something|) to eat',
    'What do you eat',
    'Have you (ever|) eaten anything',
    'What is the last thing you ate',
    'What are you having for (breakfast|brunch|lunch|dinner)',
    reply(
        'No, I don\'t eat',
        'I don\'t eat',
    ),
);

intent(
    'I need (an|) advice',
    reply(
        '(OK|Alright) I\'ll do my best to help you.',
        'I\'m not programmed for general advice, but I will do my best.',
    ),
);

intent(
    '(I am|) (bad|sad|depressed)',
    reply('Sorry to hear that.'),
);

intent(
    '(test|testing)',
    '(test test|testing testing)',
    '(test test test|testing testing testing)',
    '(I am|) just testing you',
    reply('Test away (and let me know how I\'m doing|)'),
);

intent(
    'I will be back',
    'Hold on',
    'Give me a (moment|second|sec)',
    reply('OK'),
);

intent(
    'Give me a hug',
    reply(
        'I would if I had arms',
        'Unfortunately I can\'t because I don\'t have arms',
    ),
);

intent(
    'I don\'t care',
    reply('OK'),
);

intent(
    'Sorry',
    'I apologize',
    'My apologies',
    reply(
        'It\'s alright. (You don\'t have to say that|)',
    ),
);

intent(
    'What do you mean',
    'What do you mean about (it|that|)',
    reply(
        'What do I mean about what?',
        'What are you asking about?',
        'Remind me, what did you say about it?',
    ),
);

intent(
    'You are wrong',
    reply(
        'What am I wrong about?',
        follow(
            '$(Q everything|the world|all of it)',
            reply('OK, I\'ll remember that for next time'),
        ),
    ),
);
// {Name: Weather}
// {Description: Provides weather conditions and details like temperature, humidity, and pressure. Shows a widget with weather information.}

const WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather?appid=4acdb6432d18884ebc890c13a9c3cc85';
const FORECAST_URL = 'http://api.openweathermap.org/data/2.5/forecast?appid=4acdb6432d18884ebc890c13a9c3cc85';
const DATE_FORMAT = 'dddd, MMMM Do YYYY';
const PREFIX_TODAY = [
    'It\'s currently',
    'There\'s',
    'There are',
];
const PREFIX_FORECAST = [
    'It will be',
    'There will be',
    'There will be',
];
const DESCRIPTION = {
    200: ['thunderstorms with light rain', 2],
    201: ['thunderstorms with rain', 2],
    202: ['thunderstorms with heavy rain', 2],
    210: ['light thunderstorms', 2],
    211: ['thunderstorms', 2],
    212: ['heavy thunderstorms', 2],
    221: ['on and off thunderstorms', 2],
    230: ['thunderstorms with light drizzle', 2],
    231: ['thunderstorms with drizzle', 2],
    232: ['thunderstorms with heavy drizzle', 2],
    300: ['light drizzle', 1],
    301: ['drizzling', 0],
    302: ['heavy drizzle', 1],
    310: ['light rain', 1],
    311: ['raining', 0],
    312: ['heavy rain', 1],
    313: ['rain showers', 2],
    314: ['heavy rain showers', 2],
    321: ['drizzling', 0],
    500: ['light rain', 1],
    501: ['moderate rain', 1],
    502: ['heavy rain', 1],
    503: ['very heavy rain', 1],
    504: ['very heavy rain', 1],
    511: ['freezing rain', 1],
    520: ['light rain, change', 1],
    521: ['rain showers', 2],
    522: ['heavy rain showers', 2],
    531: ['on and off rain showers', 2],
    600: ['light snow', 1],
    601: ['snowing', 0],
    602: ['heavy snow', 1],
    611: ['sleet', 1],
    612: ['sleet showers', 2],
    615: ['snowing with light rain', 0],
    616: ['snowing with rain', 0],
    620: ['light snow showers', 2],
    621: ['snow showers', 2],
    622: ['heavy snow showers', 2],
    701: ['misty', 0],
    711: ['smoky', 0],
    721: ['hazy', 0],
    731: ['dust swirls', 2],
    741: ['foggy', 0],
    751: ['sandy', 0],
    761: ['dusty', 0],
    762: ['volcanic ash', 1],
    771: ['squalls', 2],
    781: ['tornados', 2],
    800: ['clear skies', 2],
    801: ['partly cloudy', 0],
    802: ['scattered clouds', 2],
    803: ['broken clouds', 2],
    804: ['overcast', 0]
};

title('Weather');

intent(
    '(what) (is|) (the|) $(QUERY weather|temperature|humidity|pressure) (like|)',
    '(what) (is|) (the|) $(QUERY weather|temperature|humidity|pressure) (like|) in $(LOC)',
    '(what) (is|) (the|) $(QUERY weather|temperature|humidity|pressure) (like|) (will be|was|) (on|) $(DATE)',
    '(what) (is|) (the|) $(QUERY weather|temperature|humidity|pressure) (like|) in $(LOC) (will be|was|) (on|) $(DATE)',
    '(is it|will it|is it going to) $(QUERY raining|rain|hot|warm|cold|chilly|cool)',
    '(is it|will it|is it going to) $(QUERY raining|rain|hot|warm|cold|chilly|cool) in $(LOC)',
    '(is it|will it|is it going to) $(QUERY raining|rain|hot|warm|cold|chilly|cool) (on|) $(DATE)',
    '(is it|will it|is it going to) $(QUERY raining|rain|hot|warm|cold|chilly|cool) in $(LOC) (will be|was|) (on|) $(DATE)',
    p => {
        p.state.query = p.QUERY.value;
        if (p.LOC) {
            p.state.location = p.LOC.value;
        }
        if (p.DATE) {
            p.state.date = p.DATE;
        }
        playWeather(p);
    },
);

follow(
    '(What is|is it|) (the|) $(QUERY weather|temperature|humidity|pressure|raining)',
    p => {
        p.state.query = p.QUERY.value;
        playWeather(p);
    },
);

follow('(And|) (what about|on|) $(DATE)', p => {
    p.state.date = p.DATE;
    playWeather(p);
});

follow('(What|and|) (is|) (in|at|about|) $(LOC)', p => {
    p.state.location = p.LOC.value;
    playWeather(p);
});

follow('(units|) (to|) (in|) $(UNITS metric|standard|imperial|celsius|fahrenheit)', p => {
    const units = p.UNITS.value.toLowerCase();
    p.state.units = getUnits(units);
    playWeather(p);
});

follow('(Where|What place)', p => {
    p.play(p.state.location? `(in|) ${p.state.location}` : 'Sorry, I don\'t know');
});

follow('(When|What time)', p => {
    p.play(p.state.date? `${p.state.date}` : 'Now');
});

follow('Thank you', p => {
    p.play('You are welcome!');
});

intent(
    'What does this app do?',
    'How does this work?',
    'What can I do here?',
    reply('This is a weather application. You can ask me anything about the weather, and I will try to answer it'),
);

const getLocationCtx = context(() => {
    follow('(it\'s|for|in|at|on|) $(LOC)', p => {
        p.resolve(p.LOC.value);
    });
    follow(
        '(I|) don\'t know',
        '(what) (can|should|must|) (I|we|) (to|) (say|point|tell)',
        p => {
            p.play('The weather in what place are you interested in?');
        },
    );
    fallback('(Please,|) (provide a|in what|point the) location');
});

async function playWeather(p) {
    const now = api.moment().tz(p.timeZone);
    const date = p.state.date? api.moment(p.state.date.date, p.timeZone) : now;
    const isToday = isDateToday(date, p.timeZone);
    const units = p.state.units || 'imperial';

    if (!p.state.location) {
        p.state.location = await getLocation(p);
    }

    const weatherUrl = `${isToday ? WEATHER_URL : FORECAST_URL}&units=${units}&q=${p.state.location}`;

    if (!isToday) {
        if (date.isBefore(api.moment(now).hours(0).minutes(0))) {
            p.play('Sorry, I do not know what was the weather in the past.');
            return;
        } else if (date.isAfter(api.moment(now).add(5 ,'days'))) {
            p.play('Sorry, I can guess weather within 5 days only.');
            return;
        }
    }

    let response;

    try {
        response = await api.axios.get(weatherUrl);
    } catch (error) {
        const code = error.response.status;

        p.play(`Could not get weather information for ${p.state.location}`)

        if (code === 404) {
            p.state.location = null;
        } else {
            console.log(`failed to get weather: ${error}, code: ${code}`);
        }
        return;
    }

    if (isToday) {
        playToday(p, response.data);
    } else {
        playForecast(p, response.data);
    }
}

function playForecast(p, data) {
    let tempMin;
    let tempMax;
    let wind;
    let pressure;
    let humidity;
    let rain = false;
    const desc = {};
    const icon = {};
    const dt = api.moment(p.state.date.date).format('YYYY-MM-DD');

    const query  = p.state.query || 'weather';
    const units = p.state.units || 'imperial';

    data.list.forEach((item) => {
        if (item.dt_txt.includes(dt)) {
            return;
        }

        tempMin = Math.min(isFinite(tempMin) ? tempMin : item.main.temp, item.main.temp);
        tempMax = Math.max(isFinite(tempMax) ? tempMax : item.main.temp, item.main.temp);
        wind = Math.max(isFinite(wind) ? wind : item.wind.speed, item.wind.speed);
        pressure = Math.max(isFinite(pressure) ? pressure : item.main.pressure, item.main.pressure);
        humidity = Math.max(isFinite(humidity) ? humidity : item.main.humidity, item.main.humidity);

        const {
            id,
            description,
        } = item.weather[0];

        if (description.includes('rain')) {
            rain = true;
        }

        desc[id] = desc.hasOwnProperty(id) ? desc[id] + 1 : 1;
        icon[id] = item.weather[0].icon;
    });

    let max = 0;

    let frequentWeatherId;

    Object.keys(desc).forEach(id => {
        const count = desc[id];
        if (max < count) {
            max = count;
            frequentWeatherId = id;
        }
    });

    showWeatherReport(p, units, {
        name: data.city.name,
        icon: icon[frequentWeatherId],
        desc: DESCRIPTION[frequentWeatherId][0],
        wind_speed: wind,
        temp: tempMax,
        humidity,
        pressure,
    });

    switch (query) {
        case 'rain':
        case 'raining':
            if (rain) {
                p.play(
                    `Yes, ${p.state.date} in ${p.state.location} we are expecting a rain`,
                    'Yes, don\'t forget to take an umbrella!',
                );
            } else {
                const on = p.state.date.indexOf(' ') === -1? '': 'on';
                p.play(`(No,| as I know) it will not be raining in ${p.state.location} ${on} ${p.state.date}`);
            }
            break;
        case 'temperature':
            p.play(`The temperature will be from ${Math.floor(tempMin)} to ${Math.floor(tempMax)} ${getDegrees(units)} degrees`);
            break;
        case 'humidity':
            p.play(`The humidity in ${p.state.location} will be ${humidity} %`);
            break;
        case 'pressure':
            p.play(`The pressure in ${p.state.location} will be ${pressure} hPa`);
            break;
        case 'weather':
            p.play(description(frequentWeatherId, tempMin, tempMax, p.state.location, units, false));
            break;
    }
}

function playToday(p, data) {
    const weatherDescription = data.weather[0].description;
    const query  = p.state.query || 'weather';
    const units = p.state.units || 'imperial';

    showWeatherReport(p, units, {
        name: data.name,
        icon: data.weather[0].icon,
        desc: weatherDescription,
        wind_speed: data.wind.speed,
        humidity: data.main.humidity,
        temp: data.main.temp,
        pressure: data.main.pressure,
    });

    switch (query) {
        case 'rain':
        case 'raining':
            if (weatherDescription.includes('rain')) {
                p.play('Yes, it\'s raining now. Don\'t forget to take an umbrella!');
            } else {
                p.play('(No|You are lucky), it\'s not raining now');
            }
            break;
        case 'temperature':
            p.play(`The temperature is ${Math.floor(data.main.temp)} ${getDegrees(units)} degrees in ${data.name}`);
            break;
        case 'humidity':
            p.play(`The humidity is ${data.main.humidity}% in ${data.name}`);
            break;
        case 'pressure':
            p.play(`The pressure is ${data.main.pressure} hPa in ${data.name}`);
            break;
        case 'weather':
            p.play(description(data.weather[0].id, data.main.temp, data.main.temp, p.state.location, units, true));
            break;
    }
}

function showWeatherReport(p, units, weatherData) {
    p.play({
        embeddedPage: true,
        page: 'weather.html',
        command: 'showWeather',
        weatherData,
        units,
    });
}

function description(id, temperatureMin, temperatureMax, location, units, isToday) {
    const description = DESCRIPTION[id][0];
    const prefixIndex = DESCRIPTION[id][1];

    const temperature = isToday ?
        Math.floor(temperatureMin) :
        (temperatureMin === temperatureMax ? Math.floor(temperatureMin) : ('from ' + Math.floor(temperatureMin)));

    const prefix = isToday ?
        PREFIX_TODAY[prefixIndex] :
        PREFIX_FORECAST[prefixIndex];

    const degreePrefix = prefixIndex > 0 ? 'it\'s' : '';

    return `${prefix} ${description} and ${degreePrefix} ${temperature} degrees ${getDegrees(units)} in ${location}`;
}

function getDegrees(units) {
    const unitsValue = units.toLowerCase();
    switch (unitsValue) {
        case 'metric':
            return 'Celsius';
        case 'imperial':
            return 'Fahrenheit';
        default:
            return 'Kelvin';
    }
}

function getUnits(units) {
    const unitsValue = units.toLowerCase();
    switch (unitsValue) {
        case 'celsius':
            return 'metric';
        case 'fahrenheit':
            return 'imperial';
        default:
            return unitsValue;
    }
}

function isDateToday(date, timeZone) {
    return !date || api.moment().tz(timeZone).format(DATE_FORMAT) === api.moment(date, timeZone).format(DATE_FORMAT);
}

function getLocation(p) {
    if (p.state.location) {
        return Promise.resolve(p.state.location);
    }
    p.play(
        'Where?',
        'I need you location',
    );
    return p.then(getLocationCtx);
}
// {Name: Calendar}
// {Description: What day is tomorrow}

title("General calendar")

intent(
    "what (date|day) $(V is|was|will be|would be|) $(DATE) $(T next year|last year|)",
    p => {
        let momentDate;
        if (p.T.value === "last year"){
            momentDate = p.DATE.moment.add(-1, 'Y');
        }
        else if (p.T.value === "next year"){
            momentDate = p.DATE.moment.add(1, 'Y');
        }
        else {
            momentDate = p.DATE.moment;
        }
        let res = momentDate.format("dddd, MMMM Do YYYY");
        p.play(`${p.DATE} ${p.V} ` + res);
    }
);

follow(
    "(and|) (what|) (about|) $(DATE)",
    p => {
        let res = p.DATE.moment.format("dddd, MMMM Do YYYY");
        p.play(`${p.DATE} ` + res)
    }
);

intent(
    "(what is|) is (my|) timezone",
    p => {
        p.play("Your current timezone is " + p.timeZone);
    }
);

intent(
    "(what is|) (the|) (current|) time (now|)",
    p => {
        p.play("Now is " + api.moment().tz(p.timeZone).format("h:mmA"));
    }
);

intent(
    "(what is|) (the|) (current|) (day|date) (now|today|)",
    p => {
        p.play("Now is " + api.moment().tz(p.timeZone).format("dddd, MMMM Do YYYY"));
    }
);

intent(
    "(what is|) (the|) (current|) day and time (now|today|)",
    p => {
        p.play("Now is " + api.moment().tz(p.timeZone).format("dddd, h:mmA"));
    }
);


title("Alan calendar")

intent(
    "when (Alan|) Turing was born",
    p => {
        let turingBirthdate = api.moment("19120612", "YYYYMMDD");
        p.play(`Alan Turing was born ${turingBirthdate.fromNow()} on ${turingBirthdate.format("dddd, MMMM Do YYYY")}`);
    }
);


title("Moon landing calendar")

intent(
    "when was the first (unmanned|) (moon landing|lunar landing)",
    p => {
        let moonLandingDateLuna = api.moment("19590913", "YYYYMMDD");
        p.play(`The first unmanned moon landing was on ${moonLandingDateLuna.format("dddd, MMMM Do YYYY")}, ${moonLandingDateLuna.fromNow()}`);
    }
);

var mannedLanding = p => {
    let moonLandingDateApollo = api.moment("19690720", "YYYYMMDD");
    p.play(`The first manned moon landing was on ${moonLandingDateApollo.format("dddd, MMMM Do YYYY")}, ${moonLandingDateApollo.fromNow()}`);
}

follow("and manned", mannedLanding);

intent("when was the first manned (moon landing|lunar landing)", mannedLanding);

// see https://momentjs.com, moment js library is available through api.moment