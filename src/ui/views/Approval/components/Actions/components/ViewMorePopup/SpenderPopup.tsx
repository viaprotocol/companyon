import React, { useMemo } from 'react';
import { Table, Col, Row } from '../Table';
import * as Values from '../Values';
import { Chain } from 'background/service/openapi';
import { useRabbySelector } from '@/ui/store';
import { isSameAddress } from '@/ui/utils';

interface SpenderData {
  spender: string;
  chain: Chain;
  protocol: {
    name: string;
    logo_url: string;
  } | null;
  hasInteraction: boolean;
  bornAt: number | null;
  rank: number | null;
  riskExposure: number;
  isEOA: boolean;
  isDanger: boolean | null;
  isRevoke?: boolean;
}

export interface Props {
  data: SpenderData;
}

export interface SpenderPopupProps extends Props {
  type: 'spender';
}

export const SpenderPopup: React.FC<Props> = ({ data }) => {
  const { contractBlacklist, contractWhitelist } = useRabbySelector((state) => {
    return state.securityEngine.userData;
  });

  const { isInBlackList, isInWhiteList } = useMemo(() => {
    return {
      isInBlackList: contractBlacklist.some(
        ({ address, chainId }) =>
          isSameAddress(address, data.spender) &&
          chainId === data.chain.serverId
      ),
      isInWhiteList: contractWhitelist.some(
        ({ address, chainId }) =>
          isSameAddress(address, data.spender) &&
          chainId === data.chain.serverId
      ),
    };
  }, [data.spender, data.chain, contractBlacklist, contractWhitelist]);

  return (
    <div>
      <div className="title">
        {data.isRevoke ? 'Revoke from' : 'Approve to'}{' '}
        <Values.Address
          address={data.spender}
          chain={data.chain}
          iconWidth="14px"
        />
      </div>
      <Table className="view-more-table">
        <Col>
          <Row className="bg-[#F6F8FF]">Protocol</Row>
          <Row>
            <Values.Protocol value={data.protocol} />
          </Row>
        </Col>
        <Col>
          <Row className="bg-[#F6F8FF]">Address type</Row>
          <Row>{data.isEOA ? 'EOA' : 'Contract'}</Row>
        </Col>
        <Col>
          <Row className="bg-[#F6F8FF]">
            {data.isEOA ? 'First on-chain' : 'Deployed time'}
          </Row>
          <Row>
            <Values.TimeSpan value={data.bornAt} />
          </Row>
        </Col>
        <Col>
          <Row
            className="bg-[#F6F8FF]"
            tip="Trust value refers to the total token approved and exposed to this contract. A low trust value indicates either risk or inactivity for 180 days."
          >
            Trust value
          </Row>
          <Row>
            {data.riskExposure === null ? (
              '-'
            ) : (
              <Values.USDValue value={data.riskExposure} />
            )}
          </Row>
        </Col>
        <Col>
          <Row className="bg-[#F6F8FF]">Popularity</Row>
          <Row>{data.rank ? `No.${data.rank} on ${data.chain.name}` : '-'}</Row>
        </Col>
        <Col>
          <Row className="bg-[#F6F8FF]">Interacted before</Row>
          <Row>
            <Values.Boolean value={data.hasInteraction} />
          </Row>
        </Col>
        <Col>
          <Row className="bg-[#F6F8FF]">Address note</Row>
          <Row>
            <Values.AddressMemo address={data.spender} />
          </Row>
        </Col>
        {data.isDanger && (
          <Col>
            <Row className="bg-[#F6F8FF]">Flagged by Rabby</Row>
            <Row>
              <Values.Boolean value={!!data.isDanger} />
            </Row>
          </Col>
        )}
        <Col>
          <Row className="bg-[#F6F8FF]">My mark</Row>
          <Row>
            <Values.AddressMark
              isContract
              address={data.spender}
              chain={data.chain}
              onBlacklist={isInBlackList}
              onWhitelist={isInWhiteList}
              onChange={() => null}
            />
          </Row>
        </Col>
      </Table>
    </div>
  );
};
