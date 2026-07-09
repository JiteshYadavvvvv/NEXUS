import { Resend } from 'resend';

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, linkedin, interests } = req.body;

        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Format interests for the email
        const interestsList = interests && interests.length > 0
            ? interests.map(i => `• ${i}`).join('\n')
            : 'No specific interests selected';

        // Send notification email to admin
        const { data: adminEmailData, error: adminEmailError } = await resend.emails.send({
            from: 'SystFlow <noreply@systflow.dev>',
            to: ['admin@systflow.dev'],
            subject: `🚀 New Early Access Signup: ${name}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #d78cfa; margin: 0;">New Early Access Signup!</h1>
                    </div>
                    
                    <div style="background-color: #2d2d2d; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
                        <h2 style="color: #ffffff; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 10px;">Contact Details</h2>
                        
                        <p style="margin: 8px 0;"><strong style="color: #d78cfa;">Name:</strong> ${name}</p>
                        <p style="margin: 8px 0;"><strong style="color: #d78cfa;">Email:</strong> <a href="mailto:${email}" style="color: #ffffff;">${email}</a></p>
                        ${linkedin ? `<p style="margin: 8px 0;"><strong style="color: #d78cfa;">LinkedIn:</strong> <a href="${linkedin}" style="color: #ffffff;">${linkedin}</a></p>` : ''}
                    </div>
                    
                    <div style="background-color: #2d2d2d; border-radius: 12px; padding: 24px;">
                        <h2 style="color: #ffffff; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 10px;">Interests</h2>
                        <div style="white-space: pre-line; color: #cccccc;">${interestsList}</div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
                        <p style="color: #888; font-size: 12px;">This email was sent from the SystFlow Early Access form</p>
                    </div>
                </div>
            `,
        });

        if (adminEmailError) {
            console.error('Error sending admin email:', adminEmailError);
            return res.status(500).json({ error: 'Failed to process signup' });
        }

        // Send confirmation email to user
        const { data: userEmailData, error: userEmailError } = await resend.emails.send({
            from: 'SystFlow <noreply@systflow.dev>',
            to: [email],
            subject: "🎉 Welcome to SystFlow's Early Access!",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #d78cfa; margin: 0;">Welcome to the Future of Software Development!</h1>
                    </div>
                    
                    <div style="background-color: #2d2d2d; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
                        <p style="font-size: 18px; margin-top: 0;">Hey ${name}! 👋</p>
                        
                        <p style="line-height: 1.6; color: #cccccc;">
                            Thank you for signing up for early access to <strong style="color: #d78cfa;">SystFlow</strong> — the autonomous software factory powered by 23+ AI agents.
                        </p>
                        
                        <p style="line-height: 1.6; color: #cccccc;">
                            You're now on the list to be among the first humans to deploy AI agents that code, review, and ship production software.
                        </p>
                    </div>
                    
                    <div style="background-color: #2d2d2d; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
                        <h2 style="color: #ffffff; margin-top: 0;">What's Next?</h2>
                        <ul style="color: #cccccc; line-height: 1.8;">
                            <li>We'll notify you when early access opens (Mid 2026)</li>
                            <li>You'll get exclusive updates on our AI agents</li>
                            <li>Priority access to new features as they're released</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <p style="color: #888; font-size: 14px;">Have questions? Reply to this email or reach out at <a href="mailto:admin@systflow.dev" style="color: #d78cfa;">admin@systflow.dev</a></p>
                    </div>
                    
                    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #333; margin-top: 20px;">
                        <p style="color: #d78cfa; font-weight: bold; font-size: 20px; margin: 0;">SYSTFLOW</p>
                        <p style="color: #888; font-size: 12px; margin-top: 5px;">The Autonomous Software Factory</p>
                    </div>
                </div>
            `,
        });

        if (userEmailError) {
            console.error('Error sending user confirmation email:', userEmailError);
            // Don't fail the request if only the confirmation email fails
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully signed up for early access!'
        });

    } catch (error) {
        console.error('Error processing signup:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
