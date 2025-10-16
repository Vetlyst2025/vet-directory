import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      clinicId,
      clinicName,
      claimantName,
      claimantEmail,
      claimantPhone,
      claimantRole,
      verificationMethod,
      verificationNotes,
    } = body;

    // Validate required fields
    if (!clinicId || !clinicName || !claimantName || !claimantEmail || !claimantRole || !verificationMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert claim into database
    const { data: claim, error: dbError } = await supabase
      .from('clinic_claims')
      .insert({
        clinic_id: clinicId,
        clinic_name: clinicName,
        claimant_name: claimantName,
        claimant_email: claimantEmail,
        claimant_phone: claimantPhone || null,
        claimant_role: claimantRole,
        verification_method: verificationMethod,
        verification_notes: verificationNotes || null,
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save claim request' },
        { status: 500 }
      );
    }

    // Send email notification to admin
    // Initialize Resend for email sending

const resend = new Resend(process.env.RESEND_API_KEY);
    try {
      await resend.emails.send({
        from: 'VetFinderPro <noreply@vetfinderpro.com>',
        to: 'practicemanager@healthypetvetclinic.com',
        subject: `🏥 New Clinic Claim Request: ${clinicName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Clinic Claim Request</h2>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Clinic Information</h3>
              <p><strong>Clinic Name:</strong> ${clinicName}</p>
              <p><strong>Clinic ID:</strong> ${clinicId}</p>
            </div>

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Claimant Information</h3>
              <p><strong>Name:</strong> ${claimantName}</p>
              <p><strong>Email:</strong> ${claimantEmail}</p>
              <p><strong>Phone:</strong> ${claimantPhone || 'Not provided'}</p>
              <p><strong>Role:</strong> ${claimantRole}</p>
            </div>

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Verification Details</h3>
              <p><strong>Preferred Method:</strong> ${verificationMethod}</p>
              ${verificationNotes ? `<p><strong>Additional Notes:</strong><br/>${verificationNotes}</p>` : ''}
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 14px;">
                Claim ID: ${claim.id}<br/>
                Submitted: ${new Date().toLocaleString()}
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Don't fail the request if email fails
    }

    // Send confirmation email to claimant
    try {
      await resend.emails.send({
        from: 'VetFinderPro <noreply@vetfinderpro.com>',
        to: claimantEmail,
        subject: `Claim Request Received for ${clinicName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Thank You for Your Claim Request!</h2>
            
            <p>Hi ${claimantName},</p>
            
            <p>We've received your request to claim <strong>${clinicName}</strong> on VetFinderPro.</p>

            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <h3 style="margin-top: 0; color: #1e40af;">What Happens Next?</h3>
              <ul style="color: #1e3a8a;">
                <li>Our team will review your claim within 1-2 business days</li>
                <li>We may contact you at ${claimantEmail}${claimantPhone ? ` or ${claimantPhone}` : ''} for verification</li>
                <li>Once approved, you'll receive login credentials to manage your clinic profile</li>
              </ul>
            </div>

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Your Claim Details</h3>
              <p><strong>Clinic:</strong> ${clinicName}</p>
              <p><strong>Your Role:</strong> ${claimantRole}</p>
              <p><strong>Verification Method:</strong> ${verificationMethod}</p>
            </div>

            <p>If you have any questions, please reply to this email.</p>

            <p style="margin-top: 30px;">
              Best regards,<br/>
              <strong>The VetFinderPro Team</strong>
            </p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px;">
                Reference ID: ${claim.id}
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Confirmation email error:', emailError);
    }

    return NextResponse.json({
      success: true,
      claimId: claim.id,
    });
  } catch (error) {
    console.error('Claim submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
