import React from 'react';
import { Link } from '@tanstack/react-router';
import { Card } from '../../components/card/Card';
import { PageHeader } from '../../components/page-header/PageHeader';
import { PageLayout } from '../../components/page-layout/PageLayout';
import { Button } from '../../components/button/Button';

const WelcomePage: React.FC = () => {
    return (
        <PageLayout maxWidth="lg">
            <Card>
                <PageHeader
                    title="Welcome to Bottle Tracker"
                    subtitle="Your personal wine collection manager"
                />

                <div className="text-center space-y-6">
                    <p className="text-gray-600 text-lg">
                        Get started by creating an account or signing in to manage your wine collection.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register">
                            <Button>Create Account</Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="secondary">Sign In</Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </PageLayout>
    );
};

export { WelcomePage };