const https = require('https');
const url = require('url');

exports.handler = async (event) => {
    try {
        console.log('Event:', JSON.stringify(event));
        
        if (!event.Records || !event.Records[0] || !event.Records[0].Sns) {
            console.error('Invalid SNS event structure');
            return { statusCode: 400, body: 'Invalid SNS event' };
        }

        const webhookUrl = process.env.SLACK_WEBHOOK_URL;
        if (!webhookUrl) {
            console.error('SLACK_WEBHOOK_URL environment variable not set');
            return { statusCode: 500, body: 'Webhook URL not configured' };
        }

        const message = event.Records[0].Sns.Message;
        
        // Attempt to parse JSON message from CloudWatch
        let parsedMessage = message;
        try {
            parsedMessage = JSON.parse(message);
        } catch (e) {
            // Not JSON, use raw string
        }

        // Format the message for Slack
        // If it's a CloudWatch Alarm JSON, pick out relevant fields
        let slackText = message;
        if (parsedMessage && parsedMessage.AlarmName) {
            const alarmName = parsedMessage.AlarmName;
            const newState = parsedMessage.NewStateValue;
            const reason = parsedMessage.NewStateReason;
            slackText = "*Alarm Triggered:* " + alarmName + "\n" +
                        "*State:* " + newState + "\n" +
                        "*Reason:* " + reason;
        } else {
          slackText = typeof parsedMessage === 'string' ? parsedMessage : JSON.stringify(parsedMessage, null, 2);
        }

        const payload = {
            text: slackText
        };

        const parsedUrl = url.parse(webhookUrl);
        const options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const result = await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    if (res.statusCode < 200 || res.statusCode >= 300) {
                       reject(new Error("Slack API returned status " + res.statusCode + ": " + body));
                    }
                    resolve(body);
                });
            });
            req.on('error', (e) => reject(e));
            req.write(JSON.stringify(payload));
            req.end();
        });

        console.log('Successfully sent to Slack:', result);
        return { statusCode: 200, body: 'Message sent to Slack' };
    } catch (error) {
        console.error('Error sending to Slack:', error.message);
        throw error;
    }
};
