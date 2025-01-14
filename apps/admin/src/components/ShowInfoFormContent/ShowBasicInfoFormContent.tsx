import { ImageFile } from '@boolti/api';
import { CloseIcon, FileUpIcon } from '@boolti/icon';
import { Button, TextField, TimePicker, useDialog } from '@boolti/ui';
import { add, format } from 'date-fns';
import { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, UseFormReturn } from 'react-hook-form';
import DaumPostcode from 'react-daum-postcode';

import Styled from './ShowInfoFormContent.styles';
import { ShowInfoFormInputs } from './types';
import { useBodyScrollLock } from '~/hooks/useBodyScrollLock';

const MAX_IMAGE_COUNT = 3;

type ShowBasicInfoFormInputs = Omit<ShowInfoFormInputs, 'notice' | 'hostName' | 'hostPhoneNumber'>;

interface ShowBasicInfoFormContentProps {
  form: UseFormReturn<ShowInfoFormInputs, unknown, ShowInfoFormInputs>;
  imageFiles: ImageFile[];
  disabled?: boolean;
  onDropImage: (acceptedFiles: File[]) => void;
  onDeleteImage: (file: ImageFile) => void;
}

const ShowBasicInfoFormContent = ({
  form,
  imageFiles,
  disabled,
  onDropImage,
  onDeleteImage,
}: ShowBasicInfoFormContentProps) => {
  const { open, close, isOpen } = useDialog();
  const detailAdressInputRef = useRef<HTMLInputElement>(null);

  const { watch, control, setValue } = form;

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxFiles: MAX_IMAGE_COUNT,
    onDrop: onDropImage,
  });

  const [hasBlurred, setHasBlurred] = useState<Record<keyof ShowBasicInfoFormInputs, boolean>>({
    name: false,
    date: false,
    startTime: false,
    runningTime: false,
    placeName: false,
    placeStreetAddress: false,
    placeDetailAddress: false,
  });

  const openDaumPostCodeWithDialog: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    open({
      title: '주소 찾기',
      content: (
        <DaumPostcode
          style={{ maxWidth: 426, height: 470 }}
          onComplete={(address) => {
            setValue('placeStreetAddress', address.roadAddress);
            detailAdressInputRef.current?.focus();
          }}
          onClose={() => {
            setHasBlurred((prev) => ({ ...prev, placeStreetAddress: true }));
            close();
          }}
        />
      ),
      onClose: close,
    });
  };

  useBodyScrollLock(isOpen);

  return (
    <Styled.ShowInfoFormGroup>
      <Styled.ShowInfoFormTitle>기본 정보</Styled.ShowInfoFormTitle>
      <Styled.ShowInfoFormRow>
        <Styled.ShowInfoFormContent>
          <Styled.ShowInfoFormLabel required>공연 포스터</Styled.ShowInfoFormLabel>
          <Styled.ShowInfoFormDescription>
            원하시는 <strong>노출 순서대로</strong> 이미지를 업로드해주세요. (최소 1장, 최대{' '}
            {MAX_IMAGE_COUNT}장 업로드 가능 / jpg, png 형식)
          </Styled.ShowInfoFormDescription>
          <Styled.PreviewImageContainer>
            {imageFiles.map((file, index) => (
              <Styled.PreviewImageWrap key={file.preview} isFirstImage={index === 0}>
                <Styled.PreviewImage
                  isFirstImage={index === 0}
                  style={{ backgroundImage: `url(${file.preview})` }}
                />
                {!disabled && (
                  <Styled.PreviewImageDeleteButton
                    type="button"
                    onClick={() => onDeleteImage(file)}
                  >
                    <CloseIcon />
                  </Styled.PreviewImageDeleteButton>
                )}
                {index === 0 && <Styled.FirstImageText>대표 사진</Styled.FirstImageText>}
              </Styled.PreviewImageWrap>
            ))}
            {imageFiles.length < MAX_IMAGE_COUNT && !disabled && (
              <Styled.FileUploadArea {...getRootProps()} imageCount={imageFiles.length}>
                <input {...getInputProps()} />
                <FileUpIcon />
                <Styled.FileUploadAreaText>
                  {imageFiles.length >= 2 ? (
                    <>
                      <span>이미지</span>
                      <span>업로드</span>
                    </>
                  ) : (
                    '이미지 업로드'
                  )}
                </Styled.FileUploadAreaText>
              </Styled.FileUploadArea>
            )}
          </Styled.PreviewImageContainer>
        </Styled.ShowInfoFormContent>
      </Styled.ShowInfoFormRow>
      <Styled.ShowInfoFormRow>
        <Styled.ShowInfoFormContent>
          <Styled.ShowInfoFormLabel required>공연명</Styled.ShowInfoFormLabel>
          <Styled.TextField>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  inputType="text"
                  size="big"
                  placeholder="공연명을 입력해 주세요 (띄어쓰기 포함 최대 40자)"
                  required
                  disabled={disabled}
                  onChange={onChange}
                  onBlur={() => {
                    onBlur();
                    setHasBlurred((prev) => ({ ...prev, name: true }));
                  }}
                  value={value ?? ''}
                  errorMessage={hasBlurred.name && !value ? '필수 입력사항입니다.' : undefined}
                />
              )}
              name="name"
            />
          </Styled.TextField>
        </Styled.ShowInfoFormContent>
      </Styled.ShowInfoFormRow>
      <Styled.ShowInfoFormRow>
        <Styled.ShowInfoFormContent>
          <Styled.ShowInfoFormLabel required>공연일</Styled.ShowInfoFormLabel>
          <Styled.TextField>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  inputType="date"
                  size="big"
                  onChange={onChange}
                  onBlur={() => {
                    onBlur();
                    setHasBlurred((prev) => ({ ...prev, date: true }));
                  }}
                  placeholder={value}
                  defaultValue={watch('date')}
                  min={format(add(new Date(), { days: 1 }), 'yyyy-MM-dd')}
                  required
                  disabled={disabled}
                  value={value ?? ''}
                  errorMessage={hasBlurred.date && !value ? '필수 입력사항입니다.' : undefined}
                />
              )}
              name="date"
            />
          </Styled.TextField>
        </Styled.ShowInfoFormContent>
      </Styled.ShowInfoFormRow>
      <Styled.ShowInfoFormRow>
        <Styled.ShowInfoFormContent>
          <Styled.ShowInfoFormLabel required>공연 시작 시간</Styled.ShowInfoFormLabel>
          <Styled.TextField>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => {
                return (
                  <TimePicker
                    disabled={disabled}
                    onChange={onChange}
                    onBlur={() => {
                      onBlur();
                      setHasBlurred((prev) => ({ ...prev, startTime: true }));
                    }}
                    value={value}
                    errorMessage={
                      hasBlurred.startTime && !value ? '필수 입력사항입니다.' : undefined
                    }
                  />
                );
              }}
              name="startTime"
            />
          </Styled.TextField>
        </Styled.ShowInfoFormContent>
        <Styled.ShowInfoFormContent>
          <Styled.ShowInfoFormLabel required>러닝타임</Styled.ShowInfoFormLabel>
          <Styled.TextField>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  inputType="number"
                  size="big"
                  min={0}
                  required
                  disabled={disabled}
                  onChange={onChange}
                  onBlur={() => {
                    onBlur();
                    setHasBlurred((prev) => ({ ...prev, runningTime: true }));
                  }}
                  value={value ?? ''}
                  errorMessage={
                    hasBlurred.runningTime && !value ? '필수 입력사항입니다.' : undefined
                  }
                />
              )}
              name="runningTime"
            />
            <Styled.TextFieldSuffix>분</Styled.TextFieldSuffix>
          </Styled.TextField>
        </Styled.ShowInfoFormContent>
      </Styled.ShowInfoFormRow>
      <Styled.ShowInfoFormRow>
        <Styled.ShowInfoFormContent>
          <Styled.ShowInfoFormLabel required>공연장명</Styled.ShowInfoFormLabel>
          <Styled.TextField>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  inputType="text"
                  size="big"
                  placeholder="공연장명을 입력해 주세요"
                  required
                  disabled={disabled}
                  onChange={onChange}
                  onBlur={() => {
                    onBlur();
                    setHasBlurred((prev) => ({ ...prev, placeName: true }));
                  }}
                  value={value ?? ''}
                  errorMessage={hasBlurred.placeName && !value ? '필수 입력사항입니다.' : undefined}
                />
              )}
              name="placeName"
            />
          </Styled.TextField>
        </Styled.ShowInfoFormContent>
      </Styled.ShowInfoFormRow>
      <Styled.ShowInfoFormRow>
        <Styled.ShowInfoFormContent>
          <Styled.ShowInfoFormLabel required>공연장 주소</Styled.ShowInfoFormLabel>
          <Styled.TextField>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { value } }) => (
                <>
                  <TextField
                    inputType="text"
                    size="big"
                    placeholder="-"
                    required
                    disabled
                    value={value ?? ''}
                    errorMessage={
                      hasBlurred.placeStreetAddress && !value ? '필수 입력사항입니다.' : undefined
                    }
                  />
                  <Button colorTheme="netural" size="bold" onClick={openDaumPostCodeWithDialog}>
                    주소 찾기
                  </Button>
                </>
              )}
              name="placeStreetAddress"
            />
          </Styled.TextField>
          <Styled.TextField>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  ref={detailAdressInputRef}
                  inputType="text"
                  size="big"
                  placeholder="상세 주소를 입력해 주세요"
                  required
                  disabled={disabled}
                  onChange={onChange}
                  onBlur={() => {
                    onBlur();
                    setHasBlurred((prev) => ({ ...prev, placeDetailAddress: true }));
                  }}
                  value={value ?? ''}
                  errorMessage={
                    hasBlurred.placeDetailAddress && !value ? '필수 입력사항입니다.' : undefined
                  }
                />
              )}
              name="placeDetailAddress"
            />
          </Styled.TextField>
        </Styled.ShowInfoFormContent>
      </Styled.ShowInfoFormRow>
    </Styled.ShowInfoFormGroup>
  );
};

export default ShowBasicInfoFormContent;
