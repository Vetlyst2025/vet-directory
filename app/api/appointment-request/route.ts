import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';


export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const {
      clinicId,
      clinicName,
      clinicEmail,
      petOwnerName,
      petOwnerEmail,
      petOwnerPhone,
      petName,
      petType,
      preferredDate,
      preferredTime,
      message
    } = body;

    // Validate required fields
    if (!petOwnerName || !petOwnerEmail || !petOwnerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert appointment request into Supabase
    const { data, error } = await supabase
      .from('appointment_requests')
      .insert([
        {
          clinic_place_id: clinicId,
          clinic_name: clinicName,
          clinic_email: clinicEmail,
          pet_owner_name: petOwnerName,
          pet_owner_email: petOwnerEmail,
          pet_owner_phone: petOwnerPhone,
          pet_name: petName,
          pet_type: petType,
          preferred_date: preferredDate,
          preferred_time: preferredTime,
          message: message,
          status: 'pending'
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to submit appointment request', details: error.message },
        { status: 500 }
      );
    }

    // Send email notification to clinic
    if (clinicEmail && process.env.RESEND_API_KEY) {
      try {
                // Initialize Resend only if API key exists
                const resend = new Resend(process.env.RESEND_API_KEY);
        // Format the preferred date nicely
        const formattedDate = preferredDate ? new Date(preferredDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : 'Not specified';

        // Format preferred time
        const timeSlots: Record<string, string> = {
          'morning': 'Morning (8AM - 12PM)',
          'afternoon': 'Afternoon (12PM - 5PM)',
          'evening': 'Evening (5PM - 8PM)'
        };
        const formattedTime = preferredTime ? timeSlots[preferredTime] || preferredTime : 'Not specified';

        await resend.emails.send({
          from: 'Vetlyst Appointments <appointments@vetlyst.com>',
          to: clinicEmail,
          replyTo: petOwnerEmail,
          subject: `New Appointment Request from ${petOwnerName}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
                  .header h1 { margin: 0; font-size: 24px; }
                  .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
                  .info-section { margin: 20px 0; padding: 20px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #667eea; }
                  .info-section h2 { margin-top: 0; font-size: 18px; color: #667eea; }
                  .info-row { margin: 10px 0; }
                  .label { font-weight: 600; color: #4b5563; }
                  .value { color: #1f2937; }
                  .message-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
                  .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; }
                  .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>🐾 New Appointment Request</h1>
                  </div>
                  
                  <div class="content">
                    <p>Hi ${clinicName} team,</p>
                    <p>You have received a new appointment request through your Vetlyst listing!</p>
                    
                    <div class="info-section">
                      <h2>Pet Owner Information</h2>
                      <div class="info-row">
                        <span class="label">Name:</span> <span class="value">${petOwnerName}</span>
                      </div>
                      <div class="info-row">
                        <span class="label">Email:</span> <span class="value"><a href="mailto:${petOwnerEmail}">${petOwnerEmail}</a></span>
                      </div>
                      <div class="info-row">
                        <span class="label">Phone:</span> <span class="value"><a href="tel:${petOwnerPhone}">${petOwnerPhone}</a></span>
                      </div>
                    </div>
                    
                    <div class="info-section">
                      <h2>Appointment Details</h2>
                      ${petName ? `<div class="info-row"><span class="label">Pet Name:</span> <span class="value">${petName}</span></div>` : ''}
                      ${petType ? `<div class="info-row"><span class="label">Pet Type:</span> <span class="value">${petType.charAt(0).toUpperCase() + petType.slice(1)}</span></div>` : ''}
                      <div class="info-row">
                        <span class="label">Preferred Date:</span> <span class="value">${formattedDate}</span>
                      </div>
                      <div class="info-row">
                        <span class="label">Preferred Time:</span> <span class="value">${formattedTime}</span>
                      </div>
                    </div>
                    
                    ${message ? `
                      <div class="message-box">
                        <strong>Additional Information:</strong><br>
                        ${message}
                      </div>
                    ` : ''}
                    
                    <p style="margin-top: 30px;">
                      <strong>Next Steps:</strong><br>
                      Please contact ${petOwnerName} as soon as possible to confirm the appointment. You can reply directly to this email or call them at ${petOwnerPhone}.
                    </p>
                    
                    <center>
                      <a href="mailto:${petOwnerEmail}" class="cta-button">Reply to ${petOwnerName}</a>
                    </center>
                  </div>
                  
                  <div class="footer">
                    <p>This appointment request was sent through <strong>Vetlyst</strong></p>
                    <p style="font-size: 12px; color: #9ca3af;">
                      Questions? Contact us at support@vetlyst.com
                    </p>
                  </div>
                </div>
              </body>
            </html>
          `
        });
        
        console.log('Email notification sent to clinic:', clinicEmail);
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the request if email fails - the data is already saved
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Appointment request submitted successfully',
      data 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
