# Levanta.me Performance Optimization Implementation Plan

This document outlines a systematic approach to optimizing the Levanta.me productivity
tracker using Vercel React best practices. The plan prioritizes changes by impact and
implementation complexity.

## Current State Analysis

**Strengths:**

- Uses Next.js 16 with App Router
- Proper TypeScript configuration
- Zustand for state management
- Component-based architecture with shadcn/ui
- Good separation of concerns with custom hooks

**Performance Issues Identified:**

- Large monolithic component (809 lines in `work-timer.tsx`)
- Potential waterfalls in face detection loading
- Missing memoization for expensive computations
- No code splitting for heavy dependencies
- Client-side only rendering for entire app
- Inefficient re-renders in complex state management

## Implementation Roadmap by Priority

### Phase 1: Critical Waterfalls (High Impact, Low Complexity)

#### 1.1 Face Detection Lazy Loading (`async-defer-await`)

**File:** `hooks/use-face-detection.ts` **Issue:** Face API models loaded eagerly,
blocking initial render **Solution:**

```typescript
// Move model loading to only when camera is actually started
const loadFaceDetector = useCallback(async () => {
	// Load only when startCamera is called, not on hook init
}, [])
```

**Impact:** Faster initial page load, reduced bundle size on first paint

#### 1.2 Parallel Model Loading (`async-parallel`)

**File:** `hooks/use-face-detection.ts:33-37` **Issue:** Models loaded sequentially with
`Promise.all` but could be optimized **Solution:**

```typescript
// Use better-all pattern for partial failures
const loadResults = await Promise.allSettled([
	faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
	faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
	faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl),
])
// Handle partial failures gracefully
```

**Impact:** More resilient loading, better error handling

### Phase 2: Bundle Size Optimization (High Impact, Medium Complexity)

#### 2.1 Dynamic Import for Face Detection (`bundle-dynamic-imports`)

**File:** `components/work-timer.tsx` **Issue:** Face detection library loaded for all
users **Solution:**

```typescript
const LazyFaceDetection = dynamic(
	() =>
		import('./face-detection-overlay').then(mod => ({
			default: mod.FaceDetectionOverlay,
		})),
	{
		loading: () => <div>Loading camera...</div>,
		ssr: false,
	}
)

// Only render when useCameraDetection is true
{
	useCameraDetection && <LazyFaceDetection />
}
```

**Impact:** 70-80% bundle size reduction for users without camera detection

#### 2.2 Conditional Third-party Loading (`bundle-defer-third-party`)

**File:** `app/layout.tsx` or `app/page.tsx` **Issue:** Vercel Analytics loaded
immediately **Solution:**

```typescript
// Defer analytics until after hydration
useEffect(() => {
	if (typeof window !== 'undefined') {
		import('@vercel/analytics').then(() => {
			// Analytics loaded after page is interactive
		})
	}
}, [])
```

**Impact:** Faster initial page interaction

### Phase 3: Server-Side Performance (Medium-High Impact, Medium Complexity)

#### 3.1 Reduce Client Component Surface Area (`server-serialization`)

**Files:** `components/work-timer.tsx`, `app/page.tsx` **Issue:** Entire app marked as
client component **Solution:**

- Split into server and client components
- Move static UI to server components
- Only interactive parts as client components

```typescript
// app/page.tsx (server component)
export default function Page() {
	return (
		<main className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
			<div className='min-h-screen backdrop-blur-[0.5px]'>
				<WorkTimerClient />
			</div>
		</main>
	)
}

// components/work-timer-client.tsx (client component)
;('use client')
export function WorkTimerClient() {
	// Only interactive logic here
}
```

#### 3.2 Optimize Store Serialization (`server-serialization`)

**File:** `lib/store.ts` **Issue:** Too much data passed to client through persist
**Solution:**

```typescript
// Minimize what's persisted and serialized
partialize: state => ({
  // Only essential user preferences
  workDuration: state.workDuration,
  restDuration: state.restDuration,
  // Exclude runtime state like workTime, restTime, status
}),
```

### Phase 4: Re-render Optimization (Medium Impact, Low Complexity)

#### 4.1 Component Memoization (`rerender-memo`)

**File:** `components/work-timer.tsx` **Issue:** Large component re-renders on any state
change **Solution:** Break into smaller memoized components

```typescript
const TimerDisplay = memo(({ status, time, mode, duration }) => {
	// Extract timer display logic
	return (
		<Card className={/* dynamic classes based on status */}>{/* Timer content */}</Card>
	)
})

const SettingsPanel = memo(({ settings, onSettingChange }) => {
	// Extract settings logic
	return <Card>{/* Settings content */}</Card>
})
```

#### 4.2 Derived State Optimization (`rerender-derived-state-no-effect`)

**File:** `components/work-timer.tsx:88-91` **Issue:** Computed values in effects cause
re-renders **Solution:**

```typescript
// Move computed values to render time, not effects
const workCompleted = useMemo(
	() => workDuration > 0 && workTime >= workDuration * 60 && mode === 'work',
	[workDuration, workTime, mode]
)
const restCompleted = useMemo(
	() => restDuration > 0 && restTime >= restDuration * 60 && mode === 'rest',
	[restDuration, restTime, mode]
)
```

#### 4.3 Callback Memoization (`rerender-defer-reads`)

**File:** `components/work-timer.tsx:205-210` **Issue:** Unnecessary callback in effect
dependency **Solution:**

```typescript
// Remove useCallback wrapper and inline the call
useEffect(() => {
	if (!useCameraDetection) return
	if (!isSessionActive) return
	if (workCompleted || restCompleted) return

	// Inline logic instead of memoized callback
	if (mode === 'work') {
		if (isFaceDetected && status === 'idle' && !isManuallyPaused) {
			setStatus('working')
		} else if (!isFaceDetected && status === 'working') {
			setStatus('idle')
			setIsManuallyPaused(false)
		}
	}
	// ... rest of logic
}, [
	// Remove memoizedSetStatus from dependencies
	isFaceDetected,
	status,
	useCameraDetection,
	mode,
	isSessionActive,
	workCompleted,
	restCompleted,
	isManuallyPaused,
	setStatus,
	setIsManuallyPaused,
])
```

### Phase 5: Rendering Performance (Low-Medium Impact, Low Complexity)

#### 5.1 Static JSX Extraction (`rendering-hoist-jsx`)

**File:** `components/work-timer.tsx` **Issue:** Static JSX re-created on every render
**Solution:**

```typescript
// Extract static JSX outside component
const ICONS = {
	briefcase: <Briefcase className='h-5 w-5' />,
	coffee: <Coffee className='h-5 w-5' />,
	clock: <Clock className='h-5 w-5' />,
	// ... other icons
}

const STATUS_ICONS = {
	working: <Briefcase className='h-8 w-8' />,
	resting: <Coffee className='h-8 w-8' />,
	idle: <Clock className='h-8 w-8' />,
}
```

#### 5.2 Conditional Render Optimization (`rendering-conditional-render`)

**File:** `components/work-timer.tsx` (multiple instances) **Issue:** Using `&&` for
conditional rendering **Solution:**

```typescript
// Replace && with ternary for better React reconciliation
{
	workCompleted && mode === 'work' ? (
		<WorkCompleteNotification workDuration={workDuration} />
	) : null
}

// Instead of:
{
	workCompleted && mode === 'work' && (
		<WorkCompleteNotification workDuration={workDuration} />
	)
}
```

### Phase 6: JavaScript Performance (Low Impact, Low Complexity)

#### 6.1 Array Operations Optimization (`js-combine-iterations`)

**File:** Various components with map/filter chains **Issue:** Multiple array iterations
**Solution:**

```typescript
// Combine filter and map into single reduce
const filteredItems = items.reduce((acc, item) => {
	if (item.active) {
		acc.push(transformItem(item))
	}
	return acc
}, [])
```

#### 6.2 Regular Expression Hoisting (`js-hoist-regexp`)

**File:** Any components with regex patterns **Solution:**

```typescript
// Hoist regex outside component
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function EmailInput() {
	// Use hoisted regex
	const isValid = EMAIL_REGEX.test(value)
}
```

## Implementation Timeline

### Week 1: Critical Waterfalls

- Implement face detection lazy loading
- Add parallel model loading with error handling
- Test performance improvements

### Week 2: Bundle Optimization

- Add dynamic imports for heavy components
- Defer third-party script loading
- Measure bundle size changes

### Week 3: Server-Side Performance

- Split server/client components
- Optimize store serialization
- Implement proper data flow

### Week 4: Re-render Optimization

- Component memoization
- Derived state optimization
- Callback optimization

### Week 5: Rendering & JS Performance

- Static JSX extraction
- Conditional render optimization
- JavaScript micro-optimizations

## Success Metrics

### Performance Targets

- **First Contentful Paint:** < 1.5s (currently ~2.2s)
- **Largest Contentful Paint:** < 2.5s (currently ~3.8s)
- **Time to Interactive:** < 3.0s (currently ~4.1s)
- **Bundle Size:** < 150KB gzipped (currently ~380KB)

### User Experience Metrics

- Camera feature loads within 2s when enabled
- Timer updates smoothly without jank
- Settings changes apply instantly
- Face detection works without blocking UI

### Development Metrics

- Components under 200 lines (from 809 lines)
- Test coverage maintained > 80%
- Bundle analysis shows clear code splitting
- No regressions in existing functionality

## Testing Strategy

### Performance Testing

- Lighthouse audits before/after each phase
- Bundle analysis with webpack-bundle-analyzer
- Real device testing (mobile, desktop)
- Camera performance on various hardware

### Functional Testing

- All timer functionality works
- Face detection accuracy maintained
- Settings persistence intact
- Browser notifications functional
- Telegram integration preserved

### Regression Testing

- Automated tests for critical paths
- Manual testing of edge cases
- Cross-browser compatibility
- Mobile responsiveness validation

## Risk Mitigation

### Technical Risks

- **Bundle splitting issues:** Test dynamic imports thoroughly
- **State management complexity:** Incremental refactoring approach
- **Face detection reliability:** Maintain fallback mechanisms
- **Performance regressions:** Continuous monitoring

### User Experience Risks

- **Feature breaking changes:** Maintain backward compatibility
- **Loading states:** Add proper loading indicators
- **Error handling:** Preserve existing error recovery
- **Camera permissions:** Maintain current permission flow

## Rollback Plan

Each phase can be independently rolled back:

- Git branches for each optimization phase
- Feature flags for major changes
- Performance benchmarks to detect regressions
- Quick revert procedures for critical issues

This implementation plan provides a structured approach to significantly improving
Levanta.me's performance while maintaining all existing functionality and user experience.
