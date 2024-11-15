import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Award, CloudIcon, Shield } from 'lucide-react'
import { Button } from './ui/button'

const PremiumFeaturesCard = () => {
  return (
    <Card className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-violet-500" />
              Premium Features
            </CardTitle>
            <CardDescription>Unlock advanced features with Pro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <Shield className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <h3 className="font-medium">Advanced Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Get deeper insights into your habits
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <CloudIcon className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <h3 className="font-medium">Cloud Backup</h3>
                  <p className="text-sm text-muted-foreground">
                    Keep your data safe and synced
                  </p>
                </div>
              </div>
            </div>
            <Button className="w-full bg-white text-primary font-bold hover:opacity-90 hover:text-white border-primary border-2 py-2 h-auto">
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
  )
}

export default PremiumFeaturesCard