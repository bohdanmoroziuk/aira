export const useChatScroll = (
  scrollContainer: Readonly<Ref<HTMLElement | null>>,
) => {
  const isAtBottom = ref(true)
  const showScrollButton = ref(false)

  // Check if chat is scrolled to bottom
  const checkScrollPosition = (): void => {
    if (scrollContainer.value) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value
      // TODO: `200` is a magic threshold — make it a named constant or an option.
      isAtBottom.value = scrollTop + clientHeight >= scrollHeight - 200
      showScrollButton.value = !isAtBottom.value
    }
  }

  // Coalesce rapid scroll / update events into one layout read per frame
  let scrollCheckRaf: number | null = null

  const scheduleScrollCheck = (): void => {
    if (scrollCheckRaf !== null) return

    scrollCheckRaf = requestAnimationFrame(() => {
      scrollCheckRaf = null
      checkScrollPosition()
    })
  }

  // TODO: this composable does three things (position tracking, the scroll
  //       animation, mount auto-scroll) — consider splitting the animation out.
  // Smooth scroll to bottom
  const scrollToBottom = (immediate = false): void => {
    if (!scrollContainer.value) return

    const targetScrollTop = scrollContainer.value.scrollHeight - scrollContainer.value.clientHeight

    if (immediate) {
      scrollContainer.value.scrollTop = targetScrollTop
      return
    }

    const startScrollTop = scrollContainer.value.scrollTop
    const distance = targetScrollTop - startScrollTop
    // TODO: magic number — hoist the animation duration to a named constant.
    const duration = 300

    const startTime = performance.now()
    function step(currentTime: number): void {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeInOutCubic
        = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

      if (scrollContainer.value) {
        scrollContainer.value.scrollTop = startScrollTop + distance * easeInOutCubic

        if (progress < 1) {
          requestAnimationFrame(step)
        }
      }
    }

    requestAnimationFrame(step)
  }

  async function pinToBottom() {
    if (isAtBottom.value) {
      // Force immediate scroll without animation when messages change
      if (scrollContainer.value) {
        await nextTick()
        // FIXME: targets `scrollHeight` while scrollToBottom targets
        //        `scrollHeight - clientHeight`. Both land at the bottom, but
        //        the two should use the same target.
        scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
      }
    }
  }

  // Add scroll event listener
  onMounted(() => {
    if (scrollContainer.value) {
      scrollContainer.value.addEventListener('scroll', scheduleScrollCheck, {
        passive: true,
      })
      nextTick(() => {
        scrollToBottom(true) // Use immediate scroll on mount
      })
    }
  })

  // Remove scroll event listener on unmount
  onUnmounted(() => {
    if (scrollCheckRaf !== null) {
      cancelAnimationFrame(scrollCheckRaf)
    }

    if (scrollContainer.value) {
      scrollContainer.value.removeEventListener('scroll', scheduleScrollCheck)
    }
  })

  // Re-check position after DOM updates, throttled to one read per frame
  onUpdated(scheduleScrollCheck)

  // TODO: `isAtBottom` is not consumed by ChatWindow — either use it there or
  //       drop it from the return.
  return {
    isAtBottom,
    showScrollButton,
    scrollToBottom,
    pinToBottom,
  }
}
