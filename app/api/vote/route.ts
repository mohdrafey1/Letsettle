import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Vote from '@/models/Vote';
import Option from '@/models/Option';
import Debate from '@/models/Debate';


export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const body = await request.json();
    const { debateId, optionId, fingerprintId } = body;

    // Get IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';

    if (!debateId || !optionId || !fingerprintId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check for existing vote
    const existingVote = await Vote.findOne({
      debateId,
      $or: [{ ip }, { fingerprintId }],
    });

    if (existingVote) {
      // If voting for the same option, do nothing
      if (existingVote.optionId.toString() === optionId) {
        return NextResponse.json({ 
          message: 'Already voted for this option',
          isChange: false 
        }, { status: 200 });
      }

      // Allow vote change - update to new option
      const oldOptionId = existingVote.optionId;

      try {
        // Update the vote record
        existingVote.optionId = optionId;
        await existingVote.save();

        // Decrement old option count
        await Option.findByIdAndUpdate(oldOptionId, { $inc: { votes: -1 } });

        // Increment new option count
        await Option.findByIdAndUpdate(optionId, { $inc: { votes: 1 } });

        // Note: Total debate votes remain the same

        return NextResponse.json({ 
          success: true, 
          isChange: true,
          oldOptionId: oldOptionId.toString()
        }, { status: 200 });
      } catch (err) {
        throw err;
      }
    }

    // New vote
    try {
      // Create Vote
      await Vote.create({ debateId, optionId, ip, fingerprintId });

      // Update Option count
      await Option.findByIdAndUpdate(optionId, { $inc: { votes: 1 } });

      // Update Debate total votes
      await Debate.findByIdAndUpdate(debateId, { $inc: { totalVotes: 1 } });

      return NextResponse.json({ 
        success: true, 
        isChange: false 
      }, { status: 201 });
    } catch (err) {
      throw err;
    }
  } catch (error) {
    // Handle unique constraint violation just in case race condition check failed
    if ((error as any).code === 11000) {
       return NextResponse.json({ error: 'You have already voted.' }, { status: 403 });
    }
    return NextResponse.json({ error: (error as Error).message || 'Server error' }, { status: 500 });
  }
}
