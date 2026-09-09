-- ==============================================================================
-- Supabase SQL Function: Delete User from auth.users by Admin
-- ==============================================================================
-- How to apply:
-- 1. Open your Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Select your project -> Go to "SQL Editor" on the left menu
-- 3. Paste this script and click "Run"
-- ==============================================================================

CREATE OR REPLACE FUNCTION delete_user_by_admin(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- 1. Ensure the requester is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- 2. Verify that the requester is an admin in public.profiles
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can delete users';
  END IF;

  -- 3. Prevent an admin from deleting their own account
  IF auth.uid() = target_user_id THEN
    RAISE EXCEPTION 'Admins cannot delete their own account';
  END IF;

  -- 4. Clean up ticket references (unassign tickets)
  UPDATE public.tickets SET assigned_to = NULL WHERE assigned_to = target_user_id;
  UPDATE public.tickets SET created_by = NULL WHERE created_by = target_user_id;

  -- 5. Delete from public.profiles
  DELETE FROM public.profiles WHERE id = target_user_id;

  -- 6. Permanently delete from Supabase Auth (auth.users)
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

-- Grant execution permission to authenticated users (the function itself verifies admin role)
GRANT EXECUTE ON FUNCTION delete_user_by_admin(UUID) TO authenticated;
