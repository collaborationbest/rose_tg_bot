import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { BOT_TOKEN } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const tgData = await request.json();
        console.log(tgData);

        if (tgData.callback_query) {
            const callbackQuery = tgData.callback_query;
            const data = callbackQuery.data; // This will be 'teacher' or 'student'

            // Handle the callback data
            if (data === 'confirm_messaging') {
                // Logic for when the teacher button is clicked
                const chatId = tgData.message.chat.id;
                const userId = tgData.message.new_chat_member.id;

                // Restrict user permissions
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/restrictChatMember`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        user_id: userId,
                        permissions: {
                            can_send_messages: true,
                            can_send_media_messages: true,
                            can_send_other_messages: true,
                            can_add_web_page_previews: true
                        }
                    })
                });
            }

            return json({ status: true });
        }

        if (tgData.message && tgData.message.new_chat_member) {
            const chatId = tgData.message.chat.id;
            const userId = tgData.message.new_chat_member.id;

            // Restrict user permissions
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/restrictChatMember`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    user_id: userId,
                    permissions: {
                        can_send_messages: false,
                        can_send_media_messages: false,
                        can_send_other_messages: false,
                        can_add_web_page_previews: false
                    }
                })
            });
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
                    {
                        text: 'Я не БОТ',
                        callback_data: "confirm_messaging",
                    }
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
