export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          published: boolean | null
          title: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean | null
          title: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidatos_cuidadores_rows: {
        Row: {
          ativo: string | null
          cargo: string | null
          cep: string
          cidade: string
          coren: string | null
          cpf: string | null
          crefito: string | null
          crm: string | null
          cursos: string | null
          data_cadastro: string | null
          data_nascimento: string
          Declaracao: string | null
          descricao: string | null
          descricao_experiencia: string | null
          disponibilidade_horarios: string | null
          disponivel_dormir_local: string
          email: string
          endereco: string
          escolaridade: string
          estado: string | null
          experiencia: string | null
          fumante: string
          id: number
          nome: string
          perfil_profissional: string | null
          possui_experiencia: string
          possui_filhos: string
          referencia_1: string | null
          referencia_2: string | null
          referencia_3: string | null
          referencias: string | null
          RG: string | null
          status_candidatura: string
          telefone: string
          ultima_atualizacao: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: string | null
          cargo?: string | null
          cep: string
          cidade: string
          coren?: string | null
          cpf?: string | null
          crefito?: string | null
          crm?: string | null
          cursos?: string | null
          data_cadastro?: string | null
          data_nascimento: string
          Declaracao?: string | null
          descricao?: string | null
          descricao_experiencia?: string | null
          disponibilidade_horarios?: string | null
          disponivel_dormir_local: string
          email: string
          endereco: string
          escolaridade: string
          estado?: string | null
          experiencia?: string | null
          fumante: string
          id?: number
          nome: string
          perfil_profissional?: string | null
          possui_experiencia: string
          possui_filhos: string
          referencia_1?: string | null
          referencia_2?: string | null
          referencia_3?: string | null
          referencias?: string | null
          RG?: string | null
          status_candidatura: string
          telefone: string
          ultima_atualizacao?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: string | null
          cargo?: string | null
          cep?: string
          cidade?: string
          coren?: string | null
          cpf?: string | null
          crefito?: string | null
          crm?: string | null
          cursos?: string | null
          data_cadastro?: string | null
          data_nascimento?: string
          Declaracao?: string | null
          descricao?: string | null
          descricao_experiencia?: string | null
          disponibilidade_horarios?: string | null
          disponivel_dormir_local?: string
          email?: string
          endereco?: string
          escolaridade?: string
          estado?: string | null
          experiencia?: string | null
          fumante?: string
          id?: number
          nome?: string
          perfil_profissional?: string | null
          possui_experiencia?: string
          possui_filhos?: string
          referencia_1?: string | null
          referencia_2?: string | null
          referencia_3?: string | null
          referencias?: string | null
          RG?: string | null
          status_candidatura?: string
          telefone?: string
          ultima_atualizacao?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      content_items: {
        Row: {
          content: Json
          created_at: string
          id: string
          last_updated: string
          status: string
          title: string
          type: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          last_updated?: string
          status: string
          title: string
          type: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          last_updated?: string
          status?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      customer: {
        Row: {
          address: string | null
          birth_date: string | null
          cep: string | null
          city: string | null
          created_at: string
          email: string
          has_children: boolean | null
          id: string
          name: string
          necessity: string | null
          smoker: boolean | null
          special_care: string | null
          state: string | null
          status: string | null
          updated_at: string
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          cep?: string | null
          city?: string | null
          created_at?: string
          email: string
          has_children?: boolean | null
          id?: string
          name: string
          necessity?: string | null
          smoker?: boolean | null
          special_care?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          cep?: string | null
          city?: string | null
          created_at?: string
          email?: string
          has_children?: boolean | null
          id?: string
          name?: string
          necessity?: string | null
          smoker?: boolean | null
          special_care?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          status: string | null
          type: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          status?: string | null
          type?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          status?: string | null
          type?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          type: string | null
          updated_at: string
          user_role: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          type?: string | null
          updated_at?: string
          user_role?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          type?: string | null
          updated_at?: string
          user_role?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          caregiver_id: string | null
          content: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          name: string | null
          published: boolean | null
          rating: number | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          caregiver_id?: string | null
          content?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          name?: string | null
          published?: boolean | null
          rating?: number | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          caregiver_id?: string | null
          content?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          name?: string | null
          published?: boolean | null
          rating?: number | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
