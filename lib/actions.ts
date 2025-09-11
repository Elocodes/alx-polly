
// 'use server';

// import { supabase } from '@/lib/supabase';
// import { revalidatePath } from 'next/cache';
// import { z } from 'zod';

// const PollSchema = z.object({
//   title: z.string().min(1, { message: 'Title is required' }),
//   options: z.array(z.string().min(1, { message: 'Option cannot be empty' })).min(2, { message: 'At least two options are required' }),
// });

// export async function createPoll(formData: FormData) {
//   const validatedFields = PollSchema.safeParse({
//     title: formData.get('title'),
//     options: [formData.get('option1'), formData.get('option2'), formData.get('option3'), formData.get('option4')].filter(Boolean),
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//     };
//   }

//   const { title, options } = validatedFields.data;

//   const { data: { user } } = await supabase.auth.getUser();

//   if (!user) {
//     return {
//       errors: {
//         auth: ['You must be logged in to create a poll.'],
//       },
//     };
//   }

//   const { data: poll, error: pollError } = await supabase
//     .from('polls')
//     .insert({ question: title, user_id: user.id })
//     .select()
//     .single();

//   if (pollError || !poll) {
//     return {
//       errors: {
//         database: ['Error creating poll.'],
//       },
//     };
//   }

//   const pollOptions = options.map(option => ({
//     text: option,
//     poll_id: poll.id,
//   }));

//   const { error: optionsError } = await supabase.from('poll_options').insert(pollOptions);

//   if (optionsError) {
//     await supabase.from('polls').delete().match({ id: poll.id });
//     return {
//       errors: {
//         database: ['Error creating poll options.'],
//       },
//     };
//   }

//   revalidatePath('/polls');

//   return {
//     message: 'Poll created successfully!',
//   };
// }


'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const PollSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  options: z.array(z.string().min(1, { message: 'Option cannot be empty' })).min(2, { message: 'At least two options are required' }),
});

function extractFormData(formData: FormData) {
  return {
    title: formData.get('title'),
    options: [formData.get('option1'), formData.get('option2'), formData.get('option3'), formData.get('option4')].filter(Boolean),
  };
}

async function insertPoll(title: string, userId: string) {
  return await supabase
    .from('polls')
    .insert({ question: title, user_id: userId })
    .select()
    .single();
}

async function insertPollOptions(options: string[], pollId: string) {
  const pollOptions = options.map((option: string) => ({
    text: option,
    poll_id: pollId,
  }));
  return await supabase.from('poll_options').insert(pollOptions);
}

export async function createPoll(formData: FormData) {
  const parsed = PollSchema.safeParse(extractFormData(formData));
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { title, options } = parsed.data;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { errors: { auth: ['You must be logged in to create a poll.'] } };
  }

  const { data: poll, error: pollError } = await insertPoll(title, user.id);
  if (pollError || !poll) {
    return { errors: { database: ['Error creating poll.'] } };
  }

  const { error: optionsError } = await insertPollOptions(options, poll.id);
  if (optionsError) {
    await supabase.from('polls').delete().match({ id: poll.id });
    return { errors: { database: ['Error creating poll options.'] } };
  }

  revalidatePath('/polls');
  return { message: 'Poll created successfully!' };
}