import { PageHeader } from '@/ui/component';
import { ViaScoreLevel } from '@/ui/models/via';
import { useRabbyGetter } from '@/ui/store';
import cx from 'classnames';
import React, { PropsWithChildren, useMemo } from 'react';
import { useViaRefferalLink } from '@/ui/utils/via';

import IconSuccess from 'ui/assets/success.svg';

import './style.less';

import QuestIcon1 from 'ui/assets/quest/quest1.svg';
import QuestIcon2 from 'ui/assets/quest/quest2.svg';
import QuestIcon3 from 'ui/assets/quest/quest3.svg';
import QuestIcon4 from 'ui/assets/quest/quest4.svg';
import QuestIcon5 from 'ui/assets/quest/quest5.svg';
import QuestIcon6 from 'ui/assets/quest/quest6.svg';
import QuestIcon7 from 'ui/assets/quest/quest7.svg';
import QuestIcon8 from 'ui/assets/quest/quest8.svg';
import QuestIcon9 from 'ui/assets/quest/quest9.svg';
import { VIA_SCORE_URL } from '@/constant/via';
import { copyTextToClipboard } from '@/ui/utils/clipboard';
import { message } from 'antd';
import { t } from '@/utils';

const QUESTS_LIST = [
  QuestIcon1,
  QuestIcon2,
  QuestIcon3,
  QuestIcon4,
  QuestIcon5,
  QuestIcon6,
  QuestIcon7,
  QuestIcon8,
  QuestIcon9,
];

function RenderQuests({
  quests,
  children,
  isAvailable = true,
}: PropsWithChildren<{ quests: ViaScoreLevel[]; isAvailable?: boolean }>) {
  return (
    <div className="flex flex-col gap-[12px]">
      {children}
      {quests.map((level) => {
        const randomQuestIndex = Math.floor(Math.random() * QUESTS_LIST.length);
        return (
          <div
            key={level.slug}
            className={cx(
              'p-[12px] rounded-[6px] flex flex-col gap-[12px] border border-[#333]',
              isAvailable ? 'bg-[#1F1F1F] ' : 'bg-white/0'
            )}
          >
            <div className="flex justify-between gap-[12px]">
              <div className="flex flex-col ">
                <div className="text-white font-semibold">{level.name}</div>
                <div className="text-[#7A7A7A]">+{level.points} points</div>
              </div>
              <div>
                <img
                  src={QUESTS_LIST[randomQuestIndex]}
                  className="w-[32px] h-[32px]"
                />
              </div>
            </div>
            {level.description && (
              <div className="p-[12px] text-white/60 text-[14px] bg-white/5 rounded-[4px]">
                <div
                  dangerouslySetInnerHTML={{ __html: level.description }}
                  className="injected-html-quest"
                />

                {level.task_url && (
                  <div className="mt-[10px] w-full flex text-center">
                    <a
                      href={level.task_url}
                      target="_blank"
                      className="w-full p-[12px] text-white font-semibold rounded-[6px] bg-[#333] hover:opacity/80"
                    >
                      Open
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ViaQuests() {
  const refferalInfo = useRabbyGetter((s) => s.viaScore.getReferralInfo);

  const refferalLink = useMemo(() => {
    if (!refferalInfo) {
      return null;
    }

    return `${VIA_SCORE_URL}/${refferalInfo.inviteCode}`;
  }, [refferalInfo]);

  const onCopyRefferalLink = React.useCallback(() => {
    if (!refferalLink) {
      return;
    }

    copyTextToClipboard(refferalLink).then(() => {
      message.success({
        icon: <img src={IconSuccess} className="icon icon-success" />,
        content: t('global.copied'),
        duration: 0.5,
      });
    });
  }, [refferalLink]);

  const levels = useRabbyGetter((s) => s.viaScore.getLevels);
  const referrals = useRabbyGetter((s) => s.viaScore.getReferralInfo);
  return (
    <div className="page-via-quests px-0 flex flex-col h-full">
      <PageHeader className="pt-[24px] mx-[20px]">
        <div className="text-[20px] font-medium">How to earn more points</div>
      </PageHeader>

      {levels ? (
        <div className="flex flex-col px-[12px] pb-[12px] gap-[12px] overflow-scroll h-full">
          {!!levels.available?.length && (
            <div>
              <div className="font-semibold text-white pb-[12px] pl-[12px]">
                Available
              </div>
              <RenderQuests quests={levels.available}>
                {referrals ? (
                  <div className="p-[12px] bg-[#1F1F1F] rounded-[6px] flex flex-col gap-[12px] border border-[#333] ">
                    <div className="flex justify-between gap-[12px]">
                      <div className="flex flex-col ">
                        <div className="text-white font-semibold">
                          Invite friends
                        </div>
                        <div className="text-[#7A7A7A]">
                          +100 points for each new user
                        </div>
                      </div>
                      <div>
                        <img
                          src={QUESTS_LIST[0]}
                          className="w-[32px] h-[32px]"
                        />
                      </div>
                    </div>
                    <div className="p-[12px] text-white/60 text-[14px] bg-white/5 rounded-[4px]">
                      <div
                        onClick={onCopyRefferalLink}
                        className="mb-[10px] bg-[#1F1F1F] rounded px-[8px] gap-[10px] flex justify-between"
                      >
                        <div className="text-[14px] text-white">
                          {refferalLink}
                        </div>
                        <button className="text-white/40">Copy</button>
                      </div>
                      Get points for each person who installs and activates
                      Companion through your link
                    </div>
                  </div>
                ) : null}
              </RenderQuests>
            </div>
          )}

          {!!levels.completed?.length && (
            <div>
              <div className="font-semibold text-white pb-[12px] pl-[12px]">
                Received
              </div>
              <RenderQuests quests={levels.completed} />
            </div>
          )}

          {!!levels.unavailable?.length && (
            <div>
              <div className="font-semibold text-white pb-[12px] pl-[12px]">
                Unavailable
              </div>
              <RenderQuests isAvailable={false} quests={levels.unavailable} />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          No available quests yet! Please, return later
        </div>
      )}
    </div>
  );
}

export { ViaQuests };
