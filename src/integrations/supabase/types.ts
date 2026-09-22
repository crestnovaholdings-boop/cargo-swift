export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          created_at: string
          due_at: string | null
          id: string
          invoice_number: string
          issued_at: string | null
          line_items: Json
          shipment_id: string | null
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          due_at?: string | null
          id?: string
          invoice_number: string
          issued_at?: string | null
          line_items?: Json
          shipment_id?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          due_at?: string | null
          id?: string
          invoice_number?: string
          issued_at?: string | null
          line_items?: Json
          shipment_id?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          created_at: string
          destination: string | null
          dimensions: string | null
          email: string
          id: string
          is_read: boolean
          message: string | null
          name: string
          origin: string | null
          phone: string | null
          shipment_type: string | null
          weight: string | null
        }
        Insert: {
          created_at?: string
          destination?: string | null
          dimensions?: string | null
          email: string
          id?: string
          is_read?: boolean
          message?: string | null
          name: string
          origin?: string | null
          phone?: string | null
          shipment_type?: string | null
          weight?: string | null
        }
        Update: {
          created_at?: string
          destination?: string | null
          dimensions?: string | null
          email?: string
          id?: string
          is_read?: boolean
          message?: string | null
          name?: string
          origin?: string | null
          phone?: string | null
          shipment_type?: string | null
          weight?: string | null
        }
        Relationships: []
      }
      shipment_email_drafts: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          body: string
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          recipient_email: string
          recipient_name: string | null
          sent_at: string | null
          shipment_id: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          body: string
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          recipient_email: string
          recipient_name?: string | null
          sent_at?: string | null
          shipment_id: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          body?: string
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          recipient_email?: string
          recipient_name?: string | null
          sent_at?: string | null
          shipment_id?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      shipment_events: {
        Row: {
          created_at: string
          id: string
          lat: number | null
          lng: number | null
          location: string | null
          note: string | null
          occurred_at: string
          shipment_id: string
          status: Database["public"]["Enums"]["shipment_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          location?: string | null
          note?: string | null
          occurred_at?: string
          shipment_id: string
          status: Database["public"]["Enums"]["shipment_status"]
        }
        Update: {
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          location?: string | null
          note?: string | null
          occurred_at?: string
          shipment_id?: string
          status?: Database["public"]["Enums"]["shipment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "shipment_events_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      shipments: {
        Row: {
          created_at: string
          created_by: string | null
          declared_value: number | null
          destination: string
          destination_lat: number | null
          destination_lng: number | null
          dimensions: string | null
          eta: string | null
          id: string
          notes: string | null
          origin: string
          origin_lat: number | null
          origin_lng: number | null
          receiver_address: string | null
          receiver_email: string | null
          receiver_name: string
          receiver_phone: string | null
          sender_address: string | null
          sender_email: string | null
          sender_name: string
          sender_phone: string | null
          service_type: string | null
          status: Database["public"]["Enums"]["shipment_status"]
          tracking_number: string
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          declared_value?: number | null
          destination: string
          destination_lat?: number | null
          destination_lng?: number | null
          dimensions?: string | null
          eta?: string | null
          id?: string
          notes?: string | null
          origin: string
          origin_lat?: number | null
          origin_lng?: number | null
          receiver_address?: string | null
          receiver_email?: string | null
          receiver_name: string
          receiver_phone?: string | null
          sender_address?: string | null
          sender_email?: string | null
          sender_name: string
          sender_phone?: string | null
          service_type?: string | null
          status?: Database["public"]["Enums"]["shipment_status"]
          tracking_number: string
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          declared_value?: number | null
          destination?: string
          destination_lat?: number | null
          destination_lng?: number | null
          dimensions?: string | null
          eta?: string | null
          id?: string
          notes?: string | null
          origin?: string
          origin_lat?: number | null
          origin_lng?: number | null
          receiver_address?: string | null
          receiver_email?: string | null
          receiver_name?: string
          receiver_phone?: string | null
          sender_address?: string | null
          sender_email?: string | null
          sender_name?: string
          sender_phone?: string | null
          service_type?: string | null
          status?: Database["public"]["Enums"]["shipment_status"]
          tracking_number?: string
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
      shipment_status:
        | "picked_up"
        | "in_transit"
        | "at_customs"
        | "delivered"
        | "exception"
        | "on_hold"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      shipment_status: [
        "picked_up",
        "in_transit",
        "at_customs",
        "delivered",
        "exception",
        "on_hold",
      ],
    },
  },
} as const
