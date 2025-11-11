"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Vote,
  MessageSquare,
  MapPin,
  Shield,
  ArrowRight,
  Zap,
  TrendingUp,
  LogIn,
  UserPlus,
  Settings,
  User,
} from "lucide-react"
import Link from "next/link"
import { T } from "@/components/auto-translate"

export default function HomePage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Vote className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">VoteHubPH</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/settings">
                <Button variant="ghost" size="icon" className="rounded-lg">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              {status === "authenticated" ? (
                <>
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      <T>Profile</T>
                    </Button>
                  </Link>
                  <Link href="/browse">
                    <Button size="sm" className="gap-2">
                      <Users className="h-4 w-4" />
                      <T>Browse</T>
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <LogIn className="h-4 w-4" />
                      <T>Sign In</T>
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      <T>Sign Up</T>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4 px-3 py-1 bg-primary/10 rounded-full">
                <span className="text-sm font-medium text-primary"><T>🇵🇭 Philippine Elections</T></span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
                <T>Your Voice Shapes the Future</T>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
                <T>Make informed voting decisions with transparent candidate information, community insights, and real-time engagement across all levels of Philippine government.</T>
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/browse">
                  <Button size="lg" className="w-full sm:w-auto">
                    <T>Explore Candidates</T>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl blur-3xl"></div>
                <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
                      <Vote className="h-5 w-5 text-primary" />
                      <div className="text-sm">
                        <p className="font-medium"><T>1000+ Candidates</T></p>
                        <p className="text-xs text-muted-foreground"><T>Across all levels</T></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div className="text-sm">
                        <p className="font-medium"><T>17 Regions</T></p>
                        <p className="text-xs text-muted-foreground"><T>Full coverage</T></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
                      <Users className="h-5 w-5 text-primary" />
                      <div className="text-sm">
                        <p className="font-medium"><T>Community Driven</T></p>
                        <p className="text-xs text-muted-foreground"><T>Real discussions</T></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4"><T>Why Choose VoteHubPH?</T></h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              <T>Everything you need to make informed voting decisions</T>
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <MapPin className="h-8 w-8 text-primary mb-2" />
                <CardTitle><T>Location-Based Discovery</T></CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <T>Find candidates specific to your barangay, city, and region. Browse all 17 regions and 100+ cities across the Philippines.</T>
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle><T>Transparent Information</T></CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <T>Access detailed platforms, past contributions, party affiliations, and verified information about every candidate.</T>
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle><T>Community Engagement</T></CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <T>Engage in discussions, share insights, and participate in community voting on candidate platforms and initiatives.</T>
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle><T>Real-Time Updates</T></CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <T>Stay informed with live candidate information, community posts, and engagement metrics updated in real-time.</T>
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle><T>Voting Analytics</T></CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <T>See community sentiment through voting and polling features. Understand what matters to your neighbors.</T>
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle><T>Secure & Private</T></CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <T>Vote and comment anonymously or publicly. Your privacy and security are our top priority.</T>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-12 mb-20 border border-primary/20">
          <h3 className="text-3xl font-bold text-center mb-12"><T>Platform Coverage</T></h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">17</div>
              <div className="text-sm text-muted-foreground"><T>Regions</T></div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-sm text-muted-foreground"><T>Cities & Municipalities</T></div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground"><T>Barangays</T></div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-muted-foreground"><T>Candidates</T></div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-20">
          <h3 className="text-3xl font-bold mb-4"><T>Ready to Make Your Voice Heard?</T></h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            <T>Join thousands of Filipinos making informed voting decisions. Start exploring candidates today.</T>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button size="lg" className="w-full sm:w-auto"><T>Browse Candidates</T></Button>
            </Link>
            <Button onClick={() => {}} variant="outline" size="lg" className="w-full sm:w-auto">
              <T>Continue as Guest</T>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">VoteHubPH</h4>
              <p className="text-sm text-muted-foreground">
                <T>Empowering informed voting decisions across the Philippines.</T>
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4"><T>Platform</T></h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/browse" className="px-2 py-1 rounded block hover:bg-muted/80 transition-colors">
                    <T>Browse Candidates</T>
                  </Link>
                </li>
                <li>
                  <Link href="/elections" className="px-2 py-1 rounded block hover:bg-muted/80 transition-colors">
                    <T>Elections & Statistics</T>
                  </Link>
                </li>
                <li>
                  <Link href="/partylist" className="px-2 py-1 rounded block hover:bg-muted/80 transition-colors">
                    <T>Party-List</T>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4"><T>Account</T></h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/login" className="px-2 py-1 rounded block hover:bg-muted/80 transition-colors">
                    <T>Sign In</T>
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="px-2 py-1 rounded block hover:bg-muted/80 transition-colors">
                    <T>Create Account</T>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4"><T>Legal</T></h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="px-2 py-1 rounded block hover:bg-muted/80 transition-colors">
                    <T>Privacy Policy</T>
                  </a>
                </li>
                <li>
                  <a href="#" className="px-2 py-1 rounded block hover:bg-muted/80 transition-colors">
                    <T>Terms of Service</T>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p><T>© 2025 VoteHubPH. Empowering informed voting decisions across the Philippines.</T></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
