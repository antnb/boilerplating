/**
 * Standard return type for all Server Actions.
 * Consistent structure enables useActionState in Client Component forms.
 *
 * @template T - Optional data payload type (e.g., { id: string })
 *
 * Usage in Server Actions:
 *   export async function createX(data: Input): Promise<ActionState<{ id: string }>>
 *
 * Usage in Client Components:
 *   const result = await createX(formData);
 *   if (result.success) { result.data?.id }
 *   if (!result.success) { result.error }
 */
export type ActionState<T = undefined> = {
    success: boolean;
    error?: string;
    data?: T;
};
