
import { createPoll } from './actions';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
      delete: jest.fn(() => ({
        match: jest.fn(),
      })),
    })),
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

function buildFormData(title: string, options: string[]) {
  const formData = new FormData();
  formData.append('title', title);
  options.forEach((opt, i) => formData.append(`option${i + 1}`, opt));
  return formData;
}

describe('createPoll', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a poll successfully', async () => {
    const formData = buildFormData('Test Poll', ['Option 1', 'Option 2']);

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: { id: 'user-id' } } });

    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: { id: 'poll-id' }, error: null }),
        }),
      }),
      delete: jest.fn().mockReturnValue({
        match: jest.fn(),
      }),
    });

    (supabase.from as jest.Mock).mockReturnValueOnce({
      insert: jest.fn().mockResolvedValue({ error: null }),
      delete: jest.fn().mockReturnValue({
        match: jest.fn(),
      }),
    });

    const result = await createPoll(formData);

    expect(result.message).toBe('Poll created successfully!');
    expect(revalidatePath).toHaveBeenCalledWith('/polls');
  });

  it('should return an error if user is not logged in', async () => {
    const formData = buildFormData('Test Poll', ['Option 1', 'Option 2']);

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: null } });

    const result = await createPoll(formData);

    // Use type assertion to inform TypeScript about possible error keys
    expect((result.errors as { auth?: string[] }).auth).toEqual(['You must be logged in to create a poll.']);
  });

  it('should return an error for invalid form data', async () => {
    const formData = buildFormData('', ['Option 1']);

    const result = await createPoll(formData);

    if (result.errors && 'title' in result.errors && 'options' in result.errors) {
      expect(result.errors.title).toBeDefined();
      expect(result.errors.options).toBeDefined();
    } else {
      throw new Error('Expected errors to have title and options properties');
    }
  });

  it('should return an error if poll creation fails', async () => {
    const formData = buildFormData('Test Poll', ['Option 1', 'Option 2']);

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: { id: 'user-id' } } });

    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } }),
        }),
      }),
      delete: jest.fn().mockReturnValue({
        match: jest.fn(),
      }),
    });

    const result = await createPoll(formData);

    expect((result.errors as { database?: string[] }).database).toEqual(['Error creating poll.']);
  });

  it('should return an error if poll options creation fails', async () => {
    const formData = buildFormData('Test Poll', ['Option 1', 'Option 2']);

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: { id: 'user-id' } } });

    (supabase.from as jest.Mock).mockReturnValueOnce({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: { id: 'poll-id' }, error: null }),
        }),
      }),
      delete: jest.fn().mockReturnValue({
        match: jest.fn(),
      }),
    });

    (supabase.from as jest.Mock).mockReturnValueOnce({
      insert: jest.fn().mockResolvedValue({ error: { message: 'Database error' } }),
      delete: jest.fn().mockReturnValue({
        match: jest.fn(),
      }),
    });

    const result = await createPoll(formData);

    expect((result.errors as { database?: string[] }).database).toEqual(['Error creating poll options.']);
  });
});