CREATE POLICY "Users can update their own messages" ON profile_messages FOR UPDATE USING (profile_id = auth.uid());
