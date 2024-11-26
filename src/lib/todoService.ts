import { supabase } from './supabase'

// Types
export interface Todo {
  id: string;          // uuid, auto-generated
  user_id?: string;    // uuid, nullable
  text: string;        // text
  completed: boolean;  // boolean, defaults to false
  created_at: string;  // timestamp with timezone
  due_date?: string;   // timestamp, nullable
}

// Create
export const createTodo = async (text: string, dueDate: string): Promise<Todo> => {
  try {
    // Ensure proper date format
    const formattedDate = new Date(dueDate).toISOString();
    console.log('Formatted date:', formattedDate); // Debug log

    const { data, error } = await supabase
      .from('todos')
      .insert({
        text: text.trim(),
        due_date: formattedDate,
        completed: false
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Failed to create todo:', error);
    throw error;
  }
};

// Read
export async function getTodos() {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Update
export async function updateTodo(id: string, updates: Partial<Todo>) {
  const { data, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Delete
export async function deleteTodo(id: string) {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Add this test function
export const testConnection = async () => {
  const { data, error } = await supabase.from('todos').select('*').limit(1);
  console.log('Connection test:', { data, error });
  return { data, error };
}; 