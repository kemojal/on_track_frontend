import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Calendar, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'

const TrackingCard = () => {
  return (
    <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Tracking Preferences
            </CardTitle>
            <CardDescription>
              Customize your habit tracking experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-card hover:bg-accent/5 transition-colors">
              <div>
                <h3 className="font-medium">Time Zone</h3>
                <p className="text-sm text-muted-foreground">
                  Currently set to UTC-8 (Pacific Time)
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                Change
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-card hover:bg-accent/5 transition-colors">
              <div>
                <h3 className="font-medium">Week Starts On</h3>
                <p className="text-sm text-muted-foreground">
                  Currently set to Monday
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                Change
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
  )
}

export default TrackingCard