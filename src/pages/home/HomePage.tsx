import React from 'react';
import { Link } from '@tanstack/react-router';
import { Card } from '../../components/card/Card';
import { PageHeader } from '../../components/page-header/PageHeader';
import { PageLayout } from '../../components/page-layout/PageLayout';
import { Button } from '../../components/button/Button';
import { useAuth } from '../../hooks/useAuth';

const HomePage: React.FC = () => {
    const { logout } = useAuth();

    return (
        <PageLayout maxWidth="lg">
            <Card>
                <PageHeader title="Dashboard" subtitle="Welcome back to your wine collection" />

                <div className="space-y-4">
                    <Link to="/wines/search">
                        <Button>Search by Barcode</Button>
                    </Link>
                    
                    <div className="pt-4">
                        <Link to="/wines">
                            <Button variant="secondary">View Wines</Button>
                        </Link>
                    </div>
                    
                    <Button variant="secondary" onClick={logout}>
                        Sign Out
                    </Button>
                </div>
            </Card>
        </PageLayout>
    );
};

export { HomePage };
