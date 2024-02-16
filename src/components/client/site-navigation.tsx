"use client";

import React, { useCallback, useEffect } from "react";
import { useDebouncedState, useEventListener, useWindowEvent } from "@mantine/hooks";

import NavItem, { NavItemProps } from "../client/nav-item";
import { Button } from "../ui/button";
import { useServerSession } from "./context/session-ctx";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SiteNavigationProps {
  navs: NavItemProps[];
}

interface ButtonVisibleStates {
  isAtStart: boolean;
  isAtEnd: boolean;
}

export default function SiteNavigation({ navs }: SiteNavigationProps) {
  const [buttonsVisible, setButtonsVisible] = useDebouncedState<ButtonVisibleStates>(
    {
      isAtStart: true,
      isAtEnd: true,
    },
    200
  );

  const checkScrollPosition = useCallback(() => {
    //? Cyclic dependency
    const navBar = ref.current;
    const navClientWidth = navBar?.clientWidth;

    if (typeof navBar?.scrollLeft === "number" && navClientWidth) {
      const isAtStart = navBar.scrollLeft === 0;
      const isAtEnd = navBar.scrollLeft + navClientWidth >= navBar.scrollWidth;

      // Update state to control button visibility
      setButtonsVisible({ isAtStart, isAtEnd });
    }
    //? !refs, !setButtonsVisible - function
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ref = useEventListener("scroll", checkScrollPosition);

  const scrollToActiveButton = useCallback(() => {
    const navBar = ref.current;

    const activeNav = navBar.querySelector("[data-state=true]") as HTMLAnchorElement;

    if (activeNav) {
      navBar.scrollLeft = activeNav.offsetLeft - (navBar.offsetLeft + 10);
    }
    //? !refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useWindowEvent("resize", () => {
    scrollToActiveButton();
    checkScrollPosition();
  });

  useEffect(() => {
    if (ref.current) {
      scrollToActiveButton();
      checkScrollPosition();
    }
    //? !refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkScrollPosition]);

  const scrollToNextPage = useCallback(() => {
    const navBar = ref.current;
    const navClientWidth = navBar?.clientWidth; // Get the width of the scrollable container

    if (navBar && navClientWidth) {
      navBar.scrollLeft += navClientWidth; // Scroll to the next "page"
      checkScrollPosition();
    }
    //? !refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkScrollPosition]);

  const scrollToPreviousPage = useCallback(() => {
    const navBar = ref.current;
    const navClientWidth = navBar?.clientWidth; // Get the width of the scrollable container

    if (navBar && navClientWidth) {
      navBar.scrollLeft -= navClientWidth; // Scroll to the previous "page"
      checkScrollPosition();
    }
    //? !refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkScrollPosition]);

  return (
    <div className="relative mx-auto flex h-10 items-center px-4 md:px-8">
      <Button
        variant="ghost"
        className="absolute left-2 h-6 items-center rounded-full bg-muted p-1 data-[state=false]:inline-flex data-[state=true]:hidden md:left-6"
        data-state={buttonsVisible.isAtStart}
        onClick={scrollToPreviousPage}
      >
        <ChevronLeft className="h-4 w-4 stroke-muted-foreground" />
      </Button>
      <nav
        className="scrollbar-none flex items-center justify-between gap-1 overflow-scroll scroll-smooth px-2"
        ref={ref}
      >
        {navs.map(({ ...nav }) => (
          <NavItem key={nav.id} {...nav} />
        ))}
      </nav>
      <Button
        variant="ghost"
        className="absolute right-2 h-6 items-center rounded-full bg-muted p-1 data-[state=false]:inline-flex data-[state=true]:hidden md:right-6"
        onClick={scrollToNextPage}
        data-state={buttonsVisible.isAtEnd}
      >
        <ChevronRight className="h-4 w-4 stroke-muted-foreground" />
      </Button>
    </div>
  );
}
