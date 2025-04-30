import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { BOT_TOKEN } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const tgData = await request.json();

        // // Check if the update is a callback query
        // if (tgData.callback_query) {
        //     const callbackQuery = tgData.callback_query;
        //     const chatId = callbackQuery.message.chat.id;
        //     const data = callbackQuery.data; // This will be 'teacher' or 'student'

        //     // Handle the callback data
        //     if (data === 'teacher') {
        //         // Logic for when the teacher button is clicked
        //         await sendMessage(chatId, "You clicked the Teacher button!");
        //     } else if (data === 'student') {
        //         // Logic for when the student button is clicked
        //         await sendMessage(chatId, "You clicked the Student button!");
        //     }

        //     return json({ status: true });
        // }

        // Extract message and chat ID
        // const chatId = tgData.message.chat.id;
        console.log(tgData);
        if (tgData.message && tgData.message.new_chat_member) {
            const chatId = tgData.message.chat.id
            const caption = "🤚 Welcome to the group! 🤚" + tgData.message.from.first_name;
            let inlineKeyboard = JSON.stringify({
                inline_keyboard: [
                    [
                        {
                            text: 'посмотреть пост',
                            url: "https://t.me/my_com555bot",
                        }

                    ],
                    [
                        {
                            text: 'просмотреть пост и поставить реакцию',
                            url: "https://t.me/my_com555bot",
                        }
                    ],
                    [
                        {
                            text: 'посетить сайт',
                            url: "https://t.me/my_com555bot",
                        }
                    ],
                    [
                        {
                            text: 'просмотреть бота',
                            url: "https://t.me/my_com555bot",
                        }
                    ],
                    [
                        {
                            text: 'войти в приложение',
                            url: "https://t.me/my_com555bot",
                        }
                    ],
                ]
            });

            let query = {
                chat_id: chatId,
                photo: `https://birthday-bot-tg-svelte.vercel.app/birthday.jpg`,
                parse_mode: 'HTML',
                reply_markup: inlineKeyboard,
                caption: caption
            };

            // Sending a reply back to the chat
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(query)
            });

            // Check if the response is ok
            if (!response.ok) {
                console.error('Error sending message:', await response.text());
                return json({ status: false }, { status: 500 });
            }

            return json({ status: true });

        }
        return json({ status: true });
        // const text = tgData.message.text;
        // const messageId = tgData.message.message_id; // Get the message ID for replying

        // let index = text.search("/start");

        // if (index > -1) {
        //     let inlineKeyboard = JSON.stringify({
        //         inline_keyboard: [
        //             [
        //                 {
        //                     text: 'Teacher',
        //                     url: "https://t.me/asharkrodry",
        //                     callback_data: 'teacher'
        //                 },
        //                 {
        //                     text: 'Student',
        //                     url: "https://t.me/mura1005",
        //                     callback_data: 'student'
        //                 }
        //             ]

        //         ]
        //     });

        //     let query = {
        //         chat_id: chatId,
        //         photo: `https://birthday-bot-tg-svelte.vercel.app/birthday.jpg`,
        //         parse_mode: 'HTML',
        //         reply_markup: inlineKeyboard,
        //         reply_to_message_id: messageId
        //     };

        //     // Sending a reply back to the chat
        //     const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(query)
        //     });

        //     // Check if the response is ok
        //     if (!response.ok) {
        //         console.error('Error sending message:', await response.text());
        //         return json({ status: false }, { status: 500 });
        //     }

        //     return json({ status: true });
        // }
        // else {
        //     return json({ status: false, message: "Command not recognized." });
        // }

    } catch (error) {
        console.error('Error:', error);
        return json({ status: false, message: "An error occurred." }, { status: 500 });
    }
};

// Function to send a message back to the chat
const sendMessage = async (chatId: number, text: string) => {
    const query = {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
    };

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    });
};

const test = () => {
    console.log("test");
}
