import React from 'react';
import ReactDOM from 'react-dom';
import { Chat, HeroCard } from '@progress/kendo-react-conversational-ui';
import { Calendar } from '@progress/kendo-react-dateinputs';
import { ApiAiClient } from 'api-ai-javascript';


const BOT_DELAY = 4000;
const BOT_SPEED = 0.03;
const BOT_MAX_CHARS = 150;

// Função específica para garantir um delay na resposta do Bot.
function getBotDelay(msg, isQuick = false) {
  let delay = isQuick ? BOT_DELAY / 2 : BOT_DELAY;
  let speed = isQuick ? BOT_SPEED * 2 : BOT_SPEED;
  return msg.length > BOT_MAX_CHARS ? delay : Math.floor(msg.length / speed);
}



class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { messages: [] };
        this.client = new ApiAiClient({
            accessToken:  'd613435beb3741359ef10904036cc4c0' //'674c12e006934cf8a8ac3282f63d1930'  
        });
        this.client.eventRequest("Welcome").then(this.onResponse, this);
        this.user = {
            id: 1,
            name: 'Você disse:'
        };
        this.bot = {
            id: "grupo-rbs-bot",
            name: 'Service Desk - Grupo RBS:',
            avatarUrl: "https://scontent.fpoa8-1.fna.fbcdn.net/v/t1.0-9/17191071_1380568748631376_1331660077214785511_n.jpg?_nc_cat=103&_nc_ht=scontent.fpoa8-1.fna&oh=2b28e3ecbdd9da9a59c661aa7d737695&oe=5C6ECA77"
        };
        this.addNewMessage = this.addNewMessage.bind(this);
    }

    attachmentTemplate = (props) => {
        let attachment = props.item;
        console.log("[Logger] - ATTACHMENT: ", props.item);
        if (attachment.type === 1) {
            return <HeroCard title={attachment.title}
            imageUrl={attachment.images ? attachment.images[0].url : ""}
            subtitle={attachment.subtitle ? attachment.subtitle : "" }
            actions={attachment.buttons}
            onActionExecute={this.addNewMessage}/>;
        } else if (attachment.type === "payment_plan") {
            return (
                <div className="k-card k-card-type-rich">
                    <div className="k-card-body">
                        { attachment.rows.map(( row, index ) =>
                            <div key={index}>{row.text}</div>
                        )}
                        <hr/><div><strong>Total:</strong>
                        <span>{attachment.premium}</span></div>
                    </div>
                </div> );
        } else if ( attachment.type === "calendar" ) {
            return <Calendar onChange={(event) => {this.addNewMessage(event);}}/>;
        }
        
    }

    parseActions = (actions) => {
        if (actions !== undefined ) {
            actions.map(action => {
                if (action.type === "postBack") {
                    action.type = 'reply';
                }
            });
            return actions;
        }
        return [];
    }

    parseText = ( event ) => {
        if (event.action !== undefined) {
            return event.action.value;
        } else if ( event.value ) {
            return event.value;
        } else {
            return event.message.text;
        }
    }


    // Mensagem descrita pelo chatbot (obtem o diálogo do Dialogflow)
    onResponse = (activity) => {
        let that = this;
       
        console.log("[Logger] - Bot disse: ", activity.result.fulfillment.messages);
        activity.result.fulfillment.messages.forEach(function(element) {
            let newMessage;
          
            newMessage = {
                text: element.speech,
                author: that.bot,
                timestamp: new Date(activity.timestamp),
                suggestedActions: element.replies ? element.replies.map(x => { 
                    return { 
                        type: "reply", 
                        title: x, 
                        value: x 
                    };}) 
                    : []
        };
            that.setState((prevState) => {
                return { messages: [ ...prevState.messages, newMessage ] };
            });
        });

       
    }

    

    // Mensagem descrita pelo usuário solicitante.
    addNewMessage = (event) => {
        let value = this.parseText(event);
        console.log("[Logger] - Usuário disse: ", value);
        this.client.textRequest(value.toString()).then(this.onResponse, this);
        if (!event.value) {
            this.setState((prevState) => {
                return { messages: [ ...prevState.messages, { 
                    author: this.user, 
                    text: value, 
                    timestamp: new Date() 
                } ] };
            });
        }
    };

    render() {
        return (
            <Chat
                messages={this.state.messages}
                user={this.user}
                onMessageSend={this.addNewMessage}
                width={450}
                attachmentTemplate={this.attachmentTemplate}
            />
        );
    }
}

ReactDOM.render(
    <App />,
    document.querySelector('my-app')
);
