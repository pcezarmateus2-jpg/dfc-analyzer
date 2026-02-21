import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
    }

    // Verificar se usuário já existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 400 });
    }

    // Criptografar senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar usuário
    const { data: user, error } = await supabase
      .from('users')
      .insert([{ email, password_hash: passwordHash, name }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar usuário:', error);
      return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json({ error: 'Erro ao processar registro' }, { status: 500 });
  }
}
