import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { LoginPage } from '../pages/login/LoginPage';

const loginSearchSchema = z.object({
    username: z.string().optional(),
});

export const Route = createFileRoute('/login')({
    component: LoginPage,
    validateSearch: loginSearchSchema,
});