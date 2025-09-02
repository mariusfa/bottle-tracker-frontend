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
                <PageHeader
                    title="Dashboard"
                    subtitle="Welcome back to your wine collection"
                />

                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">My Collection</h3>
                            <p className="text-3xl font-bold text-blue-600 mb-2">0</p>
                            <p className="text-sm text-gray-600">bottles tracked</p>
                        </Card>

                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Activity</h3>
                            <p className="text-sm text-gray-600">No recent activity</p>
                        </Card>

                        <Card>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
                            <div className="space-y-2">
                                <Link to="/wines/search">
                                    <Button>Search Wine</Button>
                                </Link>
                                <Button variant="secondary">View Collection</Button>
                            </div>
                        </Card>
                    </div>

                    <div className="text-center pt-6 border-t">
                        <Button 
                            variant="secondary" 
                            onClick={logout}
                        >
                            Sign Out
                        </Button>
                    </div>
                </div>
            </Card>
        </PageLayout>
    );
};

export { HomePage };