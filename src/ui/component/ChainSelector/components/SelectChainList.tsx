import { RABBY_SWAP_ROUTER } from '@/constant';
import { CHAINS_ENUM } from '@debank/common';
import {
  DndContext,
  MeasuringStrategy,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { DragEndEvent } from '@dnd-kit/core/dist/types';
import { SortableContext } from '@dnd-kit/sortable';
import { Chain } from 'background/service/openapi';
import clsx from 'clsx';
import React from 'react';
import { SortableSelectChainItem } from './SortableSelectChainItem';

export type SelectChainListProps = {
  className?: string;
  data: Chain[];
  sortable?: boolean;
  stared?: boolean;
  onSort?: (data: Chain[]) => void;
  value?: CHAINS_ENUM;
  onChange?: (value: CHAINS_ENUM) => void;
  onStarChange?: (v: CHAINS_ENUM, value: boolean) => void;
  pinned: CHAINS_ENUM[];
  type?: 'swap' | 'default';
};

const swapSupportChains = Object.keys(RABBY_SWAP_ROUTER);

export const SelectChainList = (props: SelectChainListProps) => {
  const {
    data,
    className,
    onSort,
    sortable = false,
    stared = false,
    value,
    onChange,
    onStarChange,
    pinned,
    type = 'default',
  } = props;
  const isSwap = type === 'swap';
  const items = data
    .map((item, index) => ({
      ...item,
      index,
    }))
    .sort((a, b) => {
      if (!isSwap) {
        return 0;
      }
      if (
        swapSupportChains.includes(a.enum) &&
        !swapSupportChains.includes(b.enum)
      ) {
        return -1;
      }
      if (
        !swapSupportChains.includes(a.enum) &&
        swapSupportChains.includes(b.enum)
      ) {
        return 1;
      }
      return 0;
    });

  const handleDragEnd = (event: DragEndEvent) => {
    const source = event.active.id;
    const destination = event.over?.id;
    if (!destination || destination === source) return;
    const sourceIndex = items.findIndex(
      (item) => item.id.toString() === source
    );
    const destinationIndex = items.findIndex(
      (item) => item.id.toString() === destination
    );
    const newItems = Array.from(items);
    const [removed] = newItems.splice(sourceIndex, 1);
    newItems.splice(destinationIndex, 0, removed);
    onSort?.(newItems);
  };
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );
  if (data?.length <= 0) {
    return null;
  }
  if (sortable) {
    return (
      <div className={clsx('select-chain-list', className)}>
        <DndContext
          onDragEnd={handleDragEnd}
          measuring={{
            droppable: { strategy: MeasuringStrategy.Always },
          }}
          sensors={sensors}
        >
          <SortableContext
            items={items.map((item) => ({ ...item, id: String(item.id) }))}
          >
            {items.map((item) => {
              return (
                <SortableSelectChainItem
                  stared={!!pinned.find((chain) => chain === item.enum)}
                  key={item.id}
                  data={item}
                  value={value}
                  onStarChange={(v) => {
                    onStarChange?.(item.enum, v);
                  }}
                  onChange={onChange}
                  disabled={
                    isSwap ? !swapSupportChains.includes(item.enum) : false
                  }
                ></SortableSelectChainItem>
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
    );
  }
  return (
    <div className={clsx('select-chain-list', className)}>
      {items.map((item) => {
        return (
          <SortableSelectChainItem
            key={item.id}
            data={item}
            value={value}
            onStarChange={(v) => {
              onStarChange?.(item.enum, v);
            }}
            stared={!!pinned.find((chain) => chain === item.enum)}
            onChange={onChange}
            disabled={isSwap ? !swapSupportChains.includes(item.enum) : false}
          ></SortableSelectChainItem>
        );
      })}
    </div>
  );
};
