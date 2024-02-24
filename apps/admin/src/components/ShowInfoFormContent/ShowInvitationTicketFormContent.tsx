import { PlusIcon } from '@boolti/icon';
import { Badge, Button, useDialog } from '@boolti/ui';
import { SubmitHandler } from 'react-hook-form';

import InvitationTicketForm, {
  InvitationTicketFormInputs,
} from '../TicketForm/InvitationTicketForm';
import Styled from './ShowInfoFormContent.styles';
import ShowInvitationCodeList from './ShowInvitationCodeList';

export interface InvitationTicket {
  id?: number;
  name: string;
  quantity: number;
  totalForSale: number;
}

interface ShowInvitationTicketFormContentProps {
  invitationTicketList: InvitationTicket[];
  description: React.ReactNode;
  fullEditable?: boolean;
  disabled?: boolean;
  showDate?: string;
  onSubmitTicket: SubmitHandler<InvitationTicketFormInputs>;
  onDeleteTicket: (ticket: InvitationTicket) => void;
}

const ShowInvitationTicketFormContent = ({
  invitationTicketList,
  description,
  fullEditable,
  disabled,
  showDate,
  onSubmitTicket,
  onDeleteTicket,
}: ShowInvitationTicketFormContentProps) => {
  const invitationTicketDialog = useDialog();

  const isSingleTicket = invitationTicketList.length === 1;

  const handleSubmitTicket: SubmitHandler<InvitationTicketFormInputs> = (data) => {
    invitationTicketDialog.close();

    onSubmitTicket(data);
  };

  return (
    <Styled.TicketGroup>
      <Styled.TicketGroupHeader>
        <Styled.TicketGroupInfo>
          <Styled.TicketGroupTitle>초청 티켓</Styled.TicketGroupTitle>
          <Styled.TicketGroupDescription>{description}</Styled.TicketGroupDescription>
        </Styled.TicketGroupInfo>
        <Styled.TicketAddButtonContainer>
          <Button
            type="button"
            colorTheme="netural"
            size="bold"
            icon={<PlusIcon />}
            onClick={() => {
              invitationTicketDialog.open({
                title: '초청 티켓 생성하기',
                content: <InvitationTicketForm onSubmit={handleSubmitTicket} />,
              });
            }}
          >
            생성하기
          </Button>
        </Styled.TicketAddButtonContainer>
      </Styled.TicketGroupHeader>
      {invitationTicketList.length > 0 && (
        <Styled.TicketList>
          {invitationTicketList.map((ticket) => {
            const isSoldTicket = ticket.totalForSale > ticket.quantity;
            const isDeleteDisabled = isSingleTicket || isSoldTicket;

            return (
              <Styled.Ticket key={ticket.id ?? ticket.name}>
                <Styled.TicketContent>
                  <Styled.TicketInfo>
                    <Styled.TicketTitle>
                      <Styled.TicketTitleText>{ticket.name}</Styled.TicketTitleText>
                      <Badge colorTheme={ticket.quantity === 0 ? 'grey' : 'red'}>
                        재고 {ticket.quantity}/{ticket.totalForSale}
                      </Badge>
                    </Styled.TicketTitle>
                    <Styled.TicketDescription>1인당 1매</Styled.TicketDescription>
                  </Styled.TicketInfo>
                  <Styled.TicketAction>
                    <Button
                      type="button"
                      colorTheme="line"
                      size="bold"
                      disabled={(() => {
                        if (disabled) return disabled;
                        if (fullEditable) return false;

                        return isDeleteDisabled;
                      })()}
                      onClick={() => onDeleteTicket(ticket)}
                    >
                      삭제하기
                    </Button>
                  </Styled.TicketAction>
                </Styled.TicketContent>
                {ticket.id !== undefined && (
                  <Styled.TicketCodeListContainer>
                    <ShowInvitationCodeList invitationTicketId={ticket.id} showDate={showDate} />
                  </Styled.TicketCodeListContainer>
                )}
              </Styled.Ticket>
            );
          })}
        </Styled.TicketList>
      )}
    </Styled.TicketGroup>
  );
};

export default ShowInvitationTicketFormContent;
