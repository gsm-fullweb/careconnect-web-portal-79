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
          cover_image: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          published: boolean | null
          slug: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean | null
          slug?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean | null
          slug?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      candidatos_cuidadores_rows: {
        Row: {
          ativo: string | null
          cargo: string | null
          cep: string
          cidade: string | null
          coren: string | null
          cpf: number | null
          crefito: string | null
          crm: string | null
          cursos: string
          data_cadastro: string | null
          data_nascimento: string | null
          Declaracao: string | null
          desconfortos_atividades: string | null
          descricao: string | null
          descricao_experiencia: string
          disponibilidade_horarios: string
          disponivel_dormir_local: string
          email: string
          endereco: string
          escolaridade: string | null
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
          referencias: string
          RG: number | null
          status_candidatura: string | null
          telefone: string
          ultima_atualizacao: string | null
          user_id: string | null
        }
        Insert: {
          ativo?: string | null
          cargo?: string | null
          cep: string
          cidade?: string | null
          coren?: string | null
          cpf?: number | null
          crefito?: string | null
          crm?: string | null
          cursos: string
          data_cadastro?: string | null
          data_nascimento?: string | null
          Declaracao?: string | null
          desconfortos_atividades?: string | null
          descricao?: string | null
          descricao_experiencia: string
          disponibilidade_horarios: string
          disponivel_dormir_local: string
          email: string
          endereco: string
          escolaridade?: string | null
          experiencia?: string | null
          fumante: string
          id?: never
          nome: string
          perfil_profissional?: string | null
          possui_experiencia: string
          possui_filhos: string
          referencia_1?: string | null
          referencia_2?: string | null
          referencia_3?: string | null
          referencias: string
          RG?: number | null
          status_candidatura?: string | null
          telefone: string
          ultima_atualizacao?: string | null
          user_id?: string | null
        }
        Update: {
          ativo?: string | null
          cargo?: string | null
          cep?: string
          cidade?: string | null
          coren?: string | null
          cpf?: number | null
          crefito?: string | null
          crm?: string | null
          cursos?: string
          data_cadastro?: string | null
          data_nascimento?: string | null
          Declaracao?: string | null
          desconfortos_atividades?: string | null
          descricao?: string | null
          descricao_experiencia?: string
          disponibilidade_horarios?: string
          disponivel_dormir_local?: string
          email?: string
          endereco?: string
          escolaridade?: string | null
          experiencia?: string | null
          fumante?: string
          id?: never
          nome?: string
          perfil_profissional?: string | null
          possui_experiencia?: string
          possui_filhos?: string
          referencia_1?: string | null
          referencia_2?: string | null
          referencia_3?: string | null
          referencias?: string
          RG?: number | null
          status_candidatura?: string | null
          telefone?: string
          ultima_atualizacao?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          active: boolean | null
          app: string | null
          bot_message: string | null
          conversation_id: string | null
          created_at: string
          id: number
          message_type: string | null
          phone: string | null
          user_id: string | null
          user_message: string | null
          user_name: string | null
        }
        Insert: {
          active?: boolean | null
          app?: string | null
          bot_message?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: number
          message_type?: string | null
          phone?: string | null
          user_id?: string | null
          user_message?: string | null
          user_name?: string | null
        }
        Update: {
          active?: boolean | null
          app?: string | null
          bot_message?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: number
          message_type?: string | null
          phone?: string | null
          user_id?: string | null
          user_message?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      chats: {
        Row: {
          app: string | null
          conversation_id: string | null
          created_at: string
          id: number
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          app?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: number
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          app?: string | null
          conversation_id?: string | null
          created_at?: string
          id?: number
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      content_items: {
        Row: {
          content: Json | null
          id: string
          last_updated: string | null
          status: string | null
          title: string
          type: string
        }
        Insert: {
          content?: Json | null
          id?: string
          last_updated?: string | null
          status?: string | null
          title: string
          type: string
        }
        Update: {
          content?: Json | null
          id?: string
          last_updated?: string | null
          status?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      customer: {
        Row: {
          address: string
          birth_date: string
          cep: string
          city: string
          created_at: string
          email: string
          has_children: boolean
          id: string
          name: string
          necessity: string
          observations: string | null
          smoker: boolean
          special_care: string
          state: string
          status: string
          updated_at: string
          user_id: string | null
          whatsapp: string
        }
        Insert: {
          address: string
          birth_date: string
          cep: string
          city: string
          created_at: string
          email: string
          has_children: boolean
          id: string
          name: string
          necessity: string
          observations?: string | null
          smoker: boolean
          special_care: string
          state: string
          status: string
          updated_at: string
          user_id?: string | null
          whatsapp: string
        }
        Update: {
          address?: string
          birth_date?: string
          cep?: string
          city?: string
          created_at?: string
          email?: string
          has_children?: boolean
          id?: string
          name?: string
          necessity?: string
          observations?: string | null
          smoker?: boolean
          special_care?: string
          state?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          active: boolean | null
          app: string | null
          cliente_name: string | null
          created_at: string
          email: string | null
          id: number
          lat: string | null
          location: string | null
          long: string | null
          phone: string | null
        }
        Insert: {
          active?: boolean | null
          app?: string | null
          cliente_name?: string | null
          created_at?: string
          email?: string | null
          id?: number
          lat?: string | null
          location?: string | null
          long?: string | null
          phone?: string | null
        }
        Update: {
          active?: boolean | null
          app?: string | null
          cliente_name?: string | null
          created_at?: string
          email?: string | null
          id?: number
          lat?: string | null
          location?: string | null
          long?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          description: string
          id: string
          logo_url: string
          name: string
          status: string
          type: string | null
          updated_at: string
          website_url: string
        }
        Insert: {
          created_at: string
          description: string
          id: string
          logo_url: string
          name: string
          status: string
          type?: string | null
          updated_at: string
          website_url: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          logo_url?: string
          name?: string
          status?: string
          type?: string | null
          updated_at?: string
          website_url?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          phone: string | null
          updated_at: string | null
          user_role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          updated_at?: string | null
          user_role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          caregiver_id: string | null
          content: string
          created_at: string
          customer_id: string
          id: string
          name: string
          published: boolean
          rating: number
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          caregiver_id?: string | null
          content: string
          created_at: string
          customer_id: string
          id: string
          name: string
          published: boolean
          rating: number
          role: string
          updated_at: string
        }
        Update: {
          avatar_url?: string | null
          caregiver_id?: string | null
          content?: string
          created_at?: string
          customer_id?: string
          id?: string
          name?: string
          published?: boolean
          rating?: number
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      user_role: "admin" | "cuidador" | "cliente"
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
    Enums: {
      user_role: ["admin", "cuidador", "cliente"],
    },
  },
} as const
