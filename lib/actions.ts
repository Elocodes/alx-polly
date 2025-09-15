'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

/**
 * @schema PollSchema
 * @description Defines the validation schema for creating a poll.
 * It ensures that a poll has a title and at least two options.
 * Why: This prevents the creation of incomplete or invalid polls, ensuring data integrity.
 */
const PollSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  options: z.array(z.string().min(1, { message: 'Option cannot be empty' })).min(2, { message: 'At least two options are required' }),
});

/**
 * @function extractFormData
 * @description Extracts and formats poll data from a FormData object.
 * This helper function simplifies the process of getting data from the form.
 * @param {FormData} formData - The FormData object from the poll creation form.
 * @returns {{title: any, options: any[]}} - An object containing the poll's title and options.
 */
function extractFormData(formData: FormData) {
  return {
    title: formData.get('title'),
    // Filters out any empty or unused option fields from the form.
    options: [formData.get('option1'), formData.get('option2'), formData.get('option3'), formData.get('option4')].filter(Boolean),
  };
}

/**
 * @function insertPoll
 * @description Inserts a new poll into the 'polls' table in the database.
 * @param {string} title - The title of the poll.
 * @param {string} userId - The ID of the user creating the poll.
 * @returns {Promise<any>} - The result of the Supabase insert operation.
 */
async function insertPoll(title: string, userId: string) {
  return await supabase
    .from('polls')
    .insert({ question: title, user_id: userId })
    .select()
    .single();
}

/**
 * @function insertPollOptions
 * @description Inserts the options for a poll into the 'poll_options' table.
 * @param {string[]} options - An array of option strings.
 * @param {string} pollId - The ID of the poll these options belong to.
 * @returns {Promise<any>} - The result of the Supabase insert operation.
 */
async function insertPollOptions(options: string[], pollId: string) {
  const pollOptions = options.map((option: string) => ({
    text: option,
    poll_id: pollId,
  }));
  return await supabase.from('poll_options').insert(pollOptions);
}

/**
 * @action createPoll
 * @description A server action to handle the creation of a new poll.
 * It validates the form data, checks for user authentication, and inserts the poll and its options into the database.
 * Why: This action centralizes the logic for poll creation, making it secure and maintainable.
 *
 * @param {FormData} formData - The data from the poll creation form.
 * @returns {Promise<{errors?: any, message?: string}>} - An object indicating success or failure.
 */
export async function createPoll(formData: FormData) {
  // Validate the form data against the schema.
  const parsed = PollSchema.safeParse(extractFormData(formData));
  if (!parsed.success) {
    // If validation fails, return the errors to be displayed in the form.
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { title, options } = parsed.data;
  const { data: { user } } = await supabase.auth.getUser();

  // Edge case: Ensure a user is logged in before allowing them to create a poll.
  if (!user) {
    return { errors: { auth: ['You must be logged in to create a poll.'] } };
  }

  // Insert the poll into the database.
  const { data: poll, error: pollError } = await insertPoll(title, user.id);
  if (pollError || !poll) {
    return { errors: { database: ['Error creating poll.'] } };
  }

  // Insert the poll options into the database.
  const { error: optionsError } = await insertPollOptions(options, poll.id);
  if (optionsError) {
    // If creating options fails, roll back the poll creation to maintain data consistency.
    await supabase.from('polls').delete().match({ id: poll.id });
    return { errors: { database: ['Error creating poll options.'] } };
  }

  // Revalidate the '/polls' path to ensure the new poll is immediately visible.
  revalidatePath('/polls');
  return { message: 'Poll created successfully!' };
}