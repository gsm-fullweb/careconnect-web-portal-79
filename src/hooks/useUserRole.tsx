
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'cuidador' | 'cliente';

interface UserRoleData {
  role: UserRole | null;
  userData: any;
  loading: boolean;
}

export const useUserRole = (): UserRoleData => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!user) {
        setRole(null);
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        console.log('Checking role for user:', user.email);
        
        // Check if user is admin (hardcoded emails or specific table)
        const adminEmails = ['admin@careconnect.com', 'admin@admin.com'];
        if (adminEmails.includes(user.email || '')) {
          console.log('User identified as admin');
          setRole('admin');
          setUserData({ email: user.email, name: 'Admin' });
          setLoading(false);
          return;
        }

        // Check if user is a caregiver candidate
        const { data: caregiverData, error: caregiverError } = await supabase
          .from('candidatos_cuidadores_rows')
          .select('*')
          .eq('email', user.email)
          .single();

        console.log('Caregiver check result:', { caregiverData, caregiverError });

        if (caregiverData && !caregiverError) {
          console.log('User identified as cuidador');
          setRole('cuidador');
          setUserData(caregiverData);
          setLoading(false);
          return;
        }

        // If not admin or caregiver, assume client
        console.log('User identified as cliente (default)');
        setRole('cliente');
        setUserData({ email: user.email, name: user.email });
        setLoading(false);

      } catch (error) {
        console.error('Error checking user role:', error);
        setLoading(false);
      }
    };

    checkUserRole();
  }, [user]);

  console.log('Current role state:', { role, loading, userEmail: user?.email });

  return { role, userData, loading };
};
