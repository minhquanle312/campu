'use client'

import VietnamMap from '@/components/vietnam-map'
import { ProvinceDetailSheet } from './_components/province-detail-sheet'
import { TripQuickViewSheet } from './_components/trip-quick-view-sheet'
import { useMemo, useState } from 'react'
import { Trip } from '@/models/trips.model'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { List, MapIcon, MapPin, Pencil, Search, X } from 'lucide-react'
import Link from 'next/link'

type JourneyMode = 'map' | 'list'

const JOURNEY_TEST_IDS = {
  searchInput: 'journey-search-input',
  modeToggle: 'journey-mode-toggle',
  listResults: 'journey-list-results',
  emptyState: 'journey-empty-state',
  mapRegion: (provinceCode: number) => `journey-map-region-${provinceCode}`,
} as const

export function normalizeJourneySearchText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

type Props = {
  trips: Trip[]
  isAdmin?: boolean
}

export default function JourneyClient({ trips, isAdmin = false }: Props) {
  const [mode, setMode] = useState<JourneyMode>('map')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProvinceCode, setSelectedProvinceCode] = useState<
    number | null
  >(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [isTripSheetOpen, setIsTripSheetOpen] = useState(false)

  const provinceCodesWithTrips = useMemo(
    () => Array.from(new Set(trips.map(trip => trip.provinceCode))),
    [trips],
  )
  const normalizedSearchQuery = normalizeJourneySearchText(searchQuery)
  const isSearchActive = normalizedSearchQuery.length > 0

  const visibleTrips = useMemo(() => {
    if (!isSearchActive) {
      return trips
    }

    return trips.filter(trip => {
      const searchableText = [
        trip.title,
        trip.summary,
        trip.provinceName,
        trip.participants.map(participant => participant.name).join(' '),
        new Date(trip.date).toLocaleDateString(),
      ].join(' ')

      return normalizeJourneySearchText(searchableText).includes(
        normalizedSearchQuery,
      )
    })
  }, [isSearchActive, normalizedSearchQuery, trips])

  const visibleProvinceCodes = useMemo(
    () => Array.from(new Set(visibleTrips.map(trip => trip.provinceCode))),
    [visibleTrips],
  )

  const matchingProvinceCodes = isSearchActive
    ? visibleProvinceCodes
    : provinceCodesWithTrips

  const highlightedProvinceCodes = matchingProvinceCodes

  const hasVisibleResults = visibleTrips.length > 0
  const activeResultLabel = isSearchActive
    ? `${visibleTrips.length} matching trip${visibleTrips.length === 1 ? '' : 's'}`
    : `${trips.length} trip${trips.length === 1 ? '' : 's'}`

  const isProvinceInteractive = (provinceCode: number) => {
    if (!provinceCodesWithTrips.includes(provinceCode)) {
      return false
    }

    if (!isSearchActive) {
      return true
    }

    return matchingProvinceCodes.includes(provinceCode)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  const handleProvinceClick = (provinceCode: number) => {
    if (!isProvinceInteractive(provinceCode)) {
      return
    }

    setSelectedProvinceCode(provinceCode)
    setIsSheetOpen(true)
  }

  const handleTripCardClick = (trip: Trip) => {
    setSelectedTrip(trip)
    setIsTripSheetOpen(true)
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-background/80 p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:max-w-xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                data-testid={JOURNEY_TEST_IDS.searchInput}
                type="search"
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder="Search trips or provinces"
                aria-label="Search trips or provinces"
                className="pl-9 pr-24"
              />

              {isSearchActive && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 h-8 -translate-y-1/2 px-2 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {isSearchActive
                ? `Showing ${activeResultLabel} for "${searchQuery.trim()}".`
                : `Browse ${activeResultLabel} across ${provinceCodesWithTrips.length} provinces.`}
            </p>
          </div>

          <fieldset
            data-testid={JOURNEY_TEST_IDS.modeToggle}
            className="inline-flex w-fit rounded-lg border border-border bg-muted/30 p-1"
          >
            <legend className="sr-only">Journey mode</legend>
            <Button
              type="button"
              variant={mode === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMode('map')}
              aria-pressed={mode === 'map'}
              className="min-w-24"
            >
              <MapIcon className="h-4 w-4" />
              Map
            </Button>
            <Button
              type="button"
              variant={mode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMode('list')}
              aria-pressed={mode === 'list'}
              className="min-w-24"
            >
              <List className="h-4 w-4" />
              List
            </Button>
          </fieldset>
        </div>

        <div
          data-testid={JOURNEY_TEST_IDS.listResults}
          data-mode={mode}
          data-search-active={isSearchActive}
          data-result-count={visibleTrips.length}
          className="sr-only"
        />

        {!hasVisibleResults && (
          <Card data-testid={JOURNEY_TEST_IDS.emptyState}>
            <CardHeader>
              <CardTitle>No matching journeys</CardTitle>
              <CardDescription>
                {isSearchActive
                  ? `No trips matched "${searchQuery.trim()}". Try another keyword or clear the current search.`
                  : 'There are no trips to show yet.'}
              </CardDescription>
            </CardHeader>
            {isSearchActive && (
              <CardContent>
                <Button type="button" variant="outline" onClick={clearSearch}>
                  Clear search
                </Button>
              </CardContent>
            )}
          </Card>
        )}
      </div>

      {mode === 'map' ? (
        <div className="relative min-h-[420px] flex-1 w-full">
          <div className="absolute inset-0 rounded-xl border border-border bg-background shadow-xs">
            <VietnamMap
              onProvinceClick={handleProvinceClick}
              highlightedProvinces={highlightedProvinceCodes}
              isProvinceInteractive={isProvinceInteractive}
              getProvinceTestId={JOURNEY_TEST_IDS.mapRegion}
            />
          </div>
        </div>
      ) : hasVisibleResults ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleTrips.map(trip => (
            <Card
              key={trip.id}
              className={cn(
                'h-full cursor-pointer transition-shadow hover:shadow-md',
              )}
              role="button"
              tabIndex={0}
              onClick={() => handleTripCardClick(trip)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleTripCardClick(trip)
                }
              }}
            >
              <CardHeader className="gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle className="text-xl leading-tight">
                      {trip.title}
                    </CardTitle>
                    <CardDescription>{trip.provinceName}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <Link
                        href={`/journey/${trip.id}/edit`}
                        onClick={e => e.stopPropagation()}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`Edit ${trip.title}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                    <Badge variant="outline">
                      {new Date(trip.date).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {trip.summary}
                </p>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1',
                    )}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    {trip.provinceName}
                  </span>
                  {trip.details?.difficulty && (
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1">
                      {trip.details.difficulty}
                    </span>
                  )}
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1">
                    {trip.participants.length} participant
                    {trip.participants.length === 1 ? '' : 's'}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1">
                    {trip.images.length + trip.videos.length} media item
                    {trip.images.length + trip.videos.length === 1 ? '' : 's'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      <ProvinceDetailSheet
        provinceCode={selectedProvinceCode}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        trips={visibleTrips}
        isAdmin={isAdmin}
      />

      <TripQuickViewSheet
        trip={selectedTrip}
        isOpen={isTripSheetOpen}
        onOpenChange={setIsTripSheetOpen}
        isAdmin={isAdmin}
      />
    </>
  )
}
